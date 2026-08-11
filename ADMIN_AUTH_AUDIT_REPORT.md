# Admin Authentication Architecture Audit Report

**Date:** 2026-10-08  
**Auditor:** Security Review  
**Scope:** Admin Portal Authentication & Authorization

---

## Executive Summary

The admin authentication system uses a **hybrid legacy-to-Supabase Auth migration strategy** with HttpOnly cookie-based sessions. While the architecture has several strong security controls, **critical vulnerabilities exist** in password storage, session validation, and admin/customer isolation that require immediate remediation.

**Overall Risk Rating: HIGH**

---

## 1. Password Storage & Validation

### Current Implementation

**File:** `lib/server/adminAuth.server.ts` (lines 64-84)

```typescript
async function getAdminByLegacyCredentials(
  username: string,
  password: string
): Promise<AdminRecord | null> {
  const supabase = createSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("admins")
    .select("id, username, password, full_name, email, role, auth_user_id")
    .eq("username", username.trim())
    .eq("password", password)  // ⚠️ PLAINTEXT COMPARISON
    .maybeSingle<AdminRecord>();
```

### Findings

| Issue | Severity | Description |
|-------|----------|-------------|
| **Plaintext Password Storage** | **CRITICAL** | Passwords stored in plaintext in `admins.password` column. Direct string equality comparison (`.eq("password", password)`) confirms no hashing. |
| **No Password Hashing** | **CRITICAL** | No bcrypt, Argon2, or PBKDF2 implementation found anywhere in admin auth flow. |
| **Legacy Credential Fallback** | **HIGH** | `loginAdminWithSupabaseAuth()` first queries by plaintext password, then migrates to Supabase Auth. This means plaintext passwords remain valid indefinitely until all admins migrate. |
| **Password Column Never Cleared** | **HIGH** | After migration to Supabase Auth, the `password` column in `admins` table is **not nulled out**, leaving plaintext credentials permanently accessible via service role. |

### Evidence

- `AdminRecord` type (line 20-28) includes `password: string` (not nullable)
- `toSafeAdmin()` (line 49-62) does NOT strip password — but it's only used post-auth
- Migration logic (lines 106-154) links Supabase Auth but **never clears** `admins.password`

### Recommendation

1. **Immediately** add `bcrypt` hashing for all admin passwords
2. Run one-time migration: hash all existing `admins.password` values, update column
3. Modify `getAdminByLegacyCredentials()` to verify via `bcrypt.compare()`
4. **Null out** `password` column after successful Supabase Auth link
5. Add `password_hash` column, deprecate `password` column

---

## 2. Route Protection (Server-Side)

### Admin Portal Routes

| Route | Protection Mechanism | Status |
|-------|---------------------|--------|
| `/admin` (login) | Public | ✅ Correct |
| `/admin/dashboard` | `AdminProtectedRoute` (client) + `requireAdmin()` (server API) | ⚠️ **Client-only guard** |
| `/admin/customers` | `AdminProtectedRoute` (client) | ⚠️ **Client-only guard** |
| `/admin/pipeline` | `AdminProtectedRoute` (client) | ⚠️ **Client-only guard** |
| `/admin/documents` | `AdminProtectedRoute` (client) | ⚠️ **Client-only guard** |
| `/admin/settings` | `AdminProtectedRoute` (client) | ⚠️ **Client-only guard** |

### Critical Gap: No Server-Side Route Protection

**File:** `app/admin/dashboard/page.tsx`, `app/admin/customers/page.tsx`, etc.

All admin pages use **only** `AdminProtectedRoute` (client-side component):

```tsx
// app/admin/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <AdminProtectedRoute>  // ← Client-side only!
      <AdminShell>
        <AdminDashboard />
      </AdminShell>
    </AdminProtectedRoute>
  );
}
```

**File:** `components/admin/auth/AdminProtectedRoute.tsx` (lines 15-50)

```typescript
useEffect(() => {
  async function verifyAdminSession() {
    const response = await fetch("/api/admin/auth/session", { ... });
    if (!response.ok) {
      sessionStorage.removeItem("admin");
      router.replace("/admin");  // ← Client-side redirect
      return;
    }
    // ...
  }
  verifyAdminSession();
}, [router]);
```

### Vulnerabilities

| Issue | Severity | Impact |
|-------|----------|--------|
| **No Server-Side Middleware** | **HIGH** | Pages render HTML before client-side check executes. Authenticated users see brief flash; unauthenticated users can view page source/structure. |
| **Client-Side Redirect Bypass** | **HIGH** | Attacker can disable JavaScript or intercept fetch to prevent redirect. |
| **No Layout-Level Protection** | **MEDIUM** | No `app/admin/layout.tsx` with server-side `requireAdmin()` call. Each page independently wraps with client guard. |
| **API Routes Protected** | ✅ **GOOD** | All `/api/admin/*` routes correctly use `await requireAdmin()` server-side. |

### Recommendation

1. Create `app/admin/layout.tsx` with server-side auth check:
```tsx
// app/admin/layout.tsx
import { requireAdmin } from "@/lib/server/adminAuth.server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin");
  }
  return <>{children}</>;
}
```
2. Remove `AdminProtectedRoute` wrapper from individual pages (keep for UX loading state only)
3. Add Next.js middleware (`middleware.ts`) for defense-in-depth

---

## 3. API Protection

### Admin API Routes

| Endpoint | Protection | Status |
|----------|------------|--------|
| `POST /api/admin/auth/login` | Public (credentials) | ✅ Correct |
| `GET /api/admin/auth/session` | Cookie validation | ✅ Correct |
| `POST /api/admin/auth/logout` | Cookie deletion | ✅ Correct |
| `GET /api/admin/customers` | `requireAdmin()` | ✅ Correct |
| `POST /api/admin/customers` | `requireAdmin()` | ✅ Correct |
| `PATCH /api/admin/customers` | `requireAdmin()` | ✅ Correct |
| `DELETE /api/admin/customers` | `requireAdmin()` | ✅ Correct |

### Implementation Review

**File:** `app/api/admin/customers/route.ts` (lines 164-177)

```typescript
// 1. Verify authenticated admin
try {
  await requireAdmin();
} catch {
  return NextResponse.json(
    { success: false, message: "Admin authentication required." },
    { status: 401 }
  );
}
```

**File:** `lib/server/adminAuth.server.ts` (lines 294-313)

```typescript
export async function requireAdmin(): Promise<SafeAdmin> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value;

  const result = await getAdminFromSessionTokens(accessToken, refreshToken);

  if (!result) {
    throw new Error("Admin authentication required.");
  }

  return result.admin;
}
```

### Findings

| Aspect | Status | Notes |
|--------|--------|-------|
| **Server-Side Validation** | ✅ **GOOD** | All admin APIs call `requireAdmin()` before any data access |
| **Token Verification** | ✅ **GOOD** | Uses Supabase Auth `getUser()` with access token |
| **Refresh Token Rotation** | ✅ **GOOD** | Implements refresh flow via `supabase.auth.refreshSession()` |
| **Service Role Usage** | ✅ **GOOD** | Uses `createSupabaseServiceRoleClient()` for DB operations (correct) |
| **Error Handling** | ✅ **GOOD** | Returns 401 without information leakage |

### Recommendation

- **No changes needed** for API protection layer — well implemented.

---

## 4. Session Security

### Cookie Configuration

**File:** `lib/server/adminAuth.server.ts` (lines 15-18)

```typescript
export const ADMIN_ACCESS_TOKEN_COOKIE = "verdyra_admin_access_token";
export const ADMIN_REFRESH_TOKEN_COOKIE = "verdyra_admin_refresh_token";
```

**File:** `app/api/admin/auth/login/route.ts` (inferred from session route)

```typescript
response.cookies.set({
  name: ADMIN_ACCESS_TOKEN_COOKIE,
  value: result.session.access_token,
  httpOnly: true,           // ✅
  sameSite: "lax",          // ✅
  secure: process.env.NODE_ENV === "production",  // ✅
  path: "/",                // ✅
  maxAge: result.session.expires_in,  // ✅ (short-lived)
});
```

### Findings

| Security Control | Status | Notes |
|------------------|--------|-------|
| **HttpOnly** | ✅ **SET** | Prevents XSS token theft |
| **Secure (HTTPS only)** | ✅ **SET** | Production only — dev allows HTTP |
| **SameSite: Lax** | ✅ **SET** | CSRF protection for navigation |
| **Path: /** | ✅ **SET** | Scoped to entire origin |
| **Access Token TTL** | ✅ **SHORT** | Uses Supabase default (~1 hour) |
| **Refresh Token TTL** | ⚠️ **LONG** | 60 days (`60 * 60 * 24 * 60`) — consider 30 days |
| **Token Rotation** | ✅ **IMPLEMENTED** | Refresh generates new access token |
| **Logout Invalidation** | ✅ **IMPLEMENTED** | Deletes both cookies |

### Session Validation Flow

**File:** `lib/server/adminAuth.server.ts` (lines 251-292)

```typescript
export async function getAdminFromSessionTokens(
  accessToken?: string,
  refreshToken?: string
): Promise<AdminSessionResult | null> {
  if (accessToken) {
    const admin = await getAdminFromAccessToken(accessToken);
    if (admin) return { admin, session: null };
  }
  if (!refreshToken) return null;
  
  const supabase = createSupabaseServerAnonClient();
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
  // ... validates new access token
}
```

### Vulnerabilities

| Issue | Severity | Description |
|-------|----------|-------------|
| **No Server-Side Session Revocation List** | **MEDIUM** | Cannot force-logout all sessions (e.g., password change, admin removal). Relies on Supabase Auth token expiry. |
| **Refresh Token Reuse Detection** | ❌ **MISSING** | No detection of stolen refresh tokens (no rotation with reuse detection). |
| **Concurrent Session Limit** | ❌ **MISSING** | No limit on simultaneous admin sessions. |
| **Session Activity Logging** | ❌ **MISSING** | No audit trail of admin logins/sessions. |

### Recommendation

1. Implement refresh token rotation with reuse detection (store hash of current refresh token)
2. Add admin session management UI (view/revoke active sessions)
3. Log authentication events (login, logout, token refresh) to audit table
4. Consider shorter refresh token TTL (30 days)

---

## 5. Customer/Admin Isolation

### Architecture Overview

| Component | Admin Portal | Customer Portal |
|-----------|--------------|-----------------|
| **Auth Table** | `admins` | `customers` |
| **Auth Provider** | Supabase Auth (linked via `auth_user_id`) | Supabase Auth (linked via `auth_user_id`) |
| **Session Cookies** | `verdyra_admin_*` | `verdyra_customer_*` |
| **Server Auth Module** | `lib/server/adminAuth.server.ts` | `lib/server/customerAuth.server.ts` |
| **Client Guard** | `AdminProtectedRoute` | `AuthGuard` |
| **API Prefix** | `/api/admin/*` | `/api/portal/*` |

### Isolation Analysis

**File:** `lib/server/adminAuth.server.ts` vs `lib/server/customerAuth.server.ts`

Both use **separate cookie names**, **separate Supabase Auth user pools**, and **separate database tables**.

| Isolation Control | Status | Evidence |
|-------------------|--------|----------|
| **Separate Cookie Namespaces** | ✅ **GOOD** | `verdyra_admin_*` vs `verdyra_customer_*` |
| **Separate DB Tables** | ✅ **GOOD** | `admins` vs `customers` |
| **Separate Supabase Auth Users** | ✅ **GOOD** | Different `auth_user_id` linkages |
| **Separate Server Modules** | ✅ **GOOD** | No shared auth logic |
| **Cross-Portal API Access** | ✅ **BLOCKED** | Admin APIs check `requireAdmin()`, Portal APIs check `requireCustomer()` |
| **Shared Service Role Client** | ⚠️ **SHARED** | Both use `createSupabaseServiceRoleClient()` — correct for server ops |

### Critical Finding: Admin Can Access Customer Data via Service Role

While the **authentication systems are isolated**, the **service role client** (used by both) has **full database access**. This is by design for admin operations, but:

- Admin APIs correctly use service role to manage customers
- Customer APIs correctly use service role for customer-specific operations
- **No vulnerability** — this is intended architecture

### Recommendation

- **No changes needed** — isolation is properly implemented at auth layer.

---

## 6. Additional Security Observations

### 6.1 Admin Account Enumeration

**File:** `app/api/admin/auth/login/route.ts` (inferred)

Login returns generic "Invalid username or password" — **GOOD**, no enumeration.

### 6.2 Brute Force Protection

**Status:** ❌ **MISSING**

- No rate limiting on `/api/admin/auth/login`
- No account lockout after failed attempts
- No CAPTCHA on admin login (unlike customer portal)

### 6.3 Password Policy

**File:** `app/api/admin/customers/route.ts` (lines 81-87) — for customers only

```typescript
function validatePassword(password: unknown): password is string {
  if (typeof password !== "string") return false;
  return password.length >= 8;  // Only length check
}
```

- **Admin password policy:** **NOT ENFORCED** (no validation on admin creation/update)
- **Customer password policy:** Minimum 8 chars only (no complexity)

### 6.4 MFA / 2FA

**Status:** ❌ **NOT IMPLEMENTED**

- No TOTP, WebAuthn, or backup codes for admin accounts
- High-value target (admin portal) lacks second factor

### 6.5 Audit Logging

**Status:** ❌ **MINIMAL**

- Console.error for auth failures only
- No structured audit trail of:
  - Admin logins (success/failure)
  - Customer data access
  - Permission changes
  - Data exports

### 6.6 CORS / CSP Headers

**Status:** ❓ **NOT VERIFIED**

- No `next.config.ts` security headers reviewed
- Should implement CSP, HSTS, X-Frame-Options, Referrer-Policy

---

## 7. Risk Summary & Prioritization

| # | Finding | Severity | Effort | Priority |
|---|---------|----------|--------|----------|
| 1 | Plaintext admin passwords in DB | **CRITICAL** | Low | **P0 — Immediate** |
| 2 | No server-side route protection (client-only guards) | **HIGH** | Low | **P0 — Immediate** |
| 3 | Password column not cleared after Supabase Auth migration | **HIGH** | Low | **P0 — Immediate** |
| 4 | No brute force protection on admin login | **HIGH** | Medium | **P1 — This Sprint** |
| 5 | No MFA/2FA for admin accounts | **HIGH** | Medium | **P1 — This Sprint** |
| 6 | Long refresh token TTL (60 days) | **MEDIUM** | Low | **P2 — Next Sprint** |
| 7 | No refresh token reuse detection | **MEDIUM** | Medium | **P2 — Next Sprint** |
| 8 | No admin session management/revocation | **MEDIUM** | Medium | **P2 — Next Sprint** |
| 9 | No audit logging for auth events | **MEDIUM** | Medium | **P2 — Next Sprint** |
| 10 | Weak password policy (length only) | **LOW** | Low | **P3 — Backlog** |
| 11 | Missing security headers (CSP, HSTS) | **LOW** | Low | **P3 — Backlog** |

---

## 8. Remediation Plan

### Phase 1: Critical (Week 1)

```bash
# 1. Add bcrypt dependency
npm install bcrypt @types/bcrypt

# 2. Create migration: hash existing passwords, add password_hash column
# 3. Update getAdminByLegacyCredentials() to use bcrypt.compare()
# 4. Null out password column after successful Supabase Auth link
# 5. Create app/admin/layout.tsx with server-side requireAdmin()
# 6. Add rate limiting to /api/admin/auth/login (e.g., 5 attempts/min/IP)
```

### Phase 2: High (Week 2-3)

```bash
# 1. Implement TOTP-based 2FA for admins
# 2. Add refresh token rotation with reuse detection
# 3. Build admin session management UI
# 4. Implement structured audit logging (auth_events table)
```

### Phase 3: Medium (Month 1)

```bash
# 1. Reduce refresh token TTL to 30 days
# 2. Add concurrent session limits
# 3. Implement CSP/HSTS headers in next.config.ts
# 4. Add password complexity requirements
```

---

## 9. Files Requiring Modification

| File | Changes Needed |
|------|----------------|
| `lib/server/adminAuth.server.ts` | Bcrypt hashing, password column clearing, refresh token rotation |
| `app/admin/layout.tsx` (NEW) | Server-side route protection |
| `app/api/admin/auth/login/route.ts` | Rate limiting, bcrypt verify |
| `middleware.ts` (NEW) | Defense-in-depth route protection |
| `lib/server/supabase.server.ts` | No changes (correctly implemented) |
| `components/admin/auth/AdminProtectedRoute.tsx` | Keep for UX loading state only |

---

## 10. Conclusion

The admin authentication system has **strong foundations** (HttpOnly cookies, Supabase Auth integration, service role separation, API protection) but **critical gaps** in password storage and route protection that pose immediate risk.

**Top 3 actions to take today:**
1. **Hash all admin passwords** — plaintext in DB is unacceptable
2. **Add server-side route protection** — client-only guards are bypassable
3. **Clear password column post-migration** — reduce attack surface

The customer portal authentication is architecturally separate and not affected by these admin-specific issues.

---

*End of Report*