import type { Session, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import {
  createSupabaseServerAnonClient,
  createSupabaseServerAuthClient,
  createSupabaseServiceRoleClient,
} from "./supabase.server";

export class CustomerAuthMigrationRequired extends Error {
  code = "CUSTOMER_AUTH_MIGRATION_REQUIRED";
  constructor(message: string) {
    super(message);
    this.name = "CustomerAuthMigrationRequired";
  }
}

export const CUSTOMER_ACCESS_TOKEN_COOKIE =
  "verdyra_customer_access_token";
export const CUSTOMER_REFRESH_TOKEN_COOKIE =
  "verdyra_customer_refresh_token";

type CustomerRecord = {
  id: string;
  username: string;
  password: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  created_at: string | null;
  loan_amount: number | null;
  product: string | null;
  application_status: string | null;
  relationship_manager: string | null;
  relationship_manager_phone: string | null;
  expected_approval_date: string | null;
  progress: number | null;
  auth_user_id: string | null;
};

export type SafeCustomer = {
  id: string;
  username: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  created_at: string | null;
  loan_amount: number | null;
  product: string | null;
  application_status: string | null;
  relationship_manager: string | null;
  relationship_manager_phone: string | null;
  expected_approval_date: string | null;
  progress: number | null;
};

function toSafeCustomer(customer: CustomerRecord): SafeCustomer {
  return {
    id: customer.id,
    username: customer.username,
    full_name: customer.full_name,
    email: customer.email,
    phone: customer.phone,
    company: customer.company,
    created_at: customer.created_at,
    loan_amount: customer.loan_amount,
    product: customer.product,
    application_status: customer.application_status,
    relationship_manager: customer.relationship_manager,
    relationship_manager_phone: customer.relationship_manager_phone,
    expected_approval_date: customer.expected_approval_date,
    progress: customer.progress,
  };
}

export async function getCustomerByUsername(
  username: string
): Promise<CustomerRecord | null> {
  const supabase = createSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("customers")
    .select(
      `id, username, password, full_name, email, phone, company, created_at, loan_amount, product, application_status, relationship_manager, relationship_manager_phone, expected_approval_date, progress, auth_user_id`
    )
    .eq("username", username.trim())
    .maybeSingle<CustomerRecord>();

  if (error) {
    throw error;
  }

  return data;
}

export async function getCustomerByAuthUserId(
  authUserId: string
): Promise<CustomerRecord | null> {
  const supabase = createSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("customers")
    .select(
      `id, username, password, full_name, email, phone, company, created_at, loan_amount, product, application_status, relationship_manager, relationship_manager_phone, expected_approval_date, progress, auth_user_id`
    )
    .eq("auth_user_id", authUserId)
    .maybeSingle<CustomerRecord>();

  if (error) {
    throw error;
  }

  return data;
}

async function signInCustomerWithSupabaseAuth(
  email: string | null,
  password: string
): Promise<Session> {
  if (!email) {
    throw new Error("Customer does not have an email address.");
  }

  const supabase = createSupabaseServerAnonClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    // Sanitize error logging - do not log sensitive auth error details
    const errorInfo = error as { code?: string; message?: string } | null;
    console.error("Supabase Auth sign-in failed:", {
      code: errorInfo?.code ?? "UNKNOWN",
      message: errorInfo?.message ?? "Unknown error",
    });
    throw error ?? new Error("Supabase Auth did not return a session.");
  }

  return data.session;
}

export type CustomerLoginResult = {
  customer: SafeCustomer;
  session: Session;
};

export async function loginCustomerWithSupabaseAuth(
  username: string,
  password: string
): Promise<CustomerLoginResult | null> {
  const customer = await getCustomerByUsername(username);

  if (!customer) {
    return null;
  }

  if (!customer.auth_user_id) {
    throw new CustomerAuthMigrationRequired(
      "Customer account requires migration to secure login."
    );
  }

  if (!customer.email) {
    throw new CustomerAuthMigrationRequired(
      "Customer account requires an email before secure login can be enabled."
    );
  }

  const session = await signInCustomerWithSupabaseAuth(
    customer.email,
    password
  );

  if (session.user.id !== customer.auth_user_id) {
    throw new Error("Supabase Auth user does not match linked customer.");
  }

  return {
    customer: toSafeCustomer(customer),
    session,
  };
}

export async function getCustomerFromAccessToken(
  accessToken: string
): Promise<SafeCustomer | null> {
  const user = await getVerifiedUser(accessToken);

  if (!user) {
    return null;
  }

  const customer = await getCustomerByAuthUserId(user.id);

  if (!customer) {
    return null;
  }

  return toSafeCustomer(customer);
}

export async function getCustomerFromSessionTokens(
  accessToken?: string,
  refreshToken?: string
): Promise<{ customer: SafeCustomer; session: Session | null } | null> {
  if (accessToken) {
    const customer = await getCustomerFromAccessToken(accessToken);

    if (customer) {
      return {
        customer,
        session: null,
      };
    }
  }

  if (!refreshToken) {
    return null;
  }

  const supabase = createSupabaseServerAnonClient();
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    return null;
  }

  const customer = await getCustomerFromAccessToken(
    data.session.access_token
  );

  if (!customer) {
    return null;
  }

  return {
    customer,
    session: data.session,
  };
}

export async function requireCustomer(): Promise<SafeCustomer> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(
    CUSTOMER_ACCESS_TOKEN_COOKIE
  )?.value;
  const refreshToken = cookieStore.get(
    CUSTOMER_REFRESH_TOKEN_COOKIE
  )?.value;

  const result = await getCustomerFromSessionTokens(
    accessToken,
    refreshToken
  );

  if (!result) {
    throw new Error("Customer authentication required.");
  }

  return result.customer;
}

async function getVerifiedUser(
  accessToken: string
): Promise<User | null> {
  const token = accessToken.trim();

  if (!token) {
    return null;
  }

  const supabase = createSupabaseServerAuthClient(token);
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return null;
  }

  return data.user;
}
