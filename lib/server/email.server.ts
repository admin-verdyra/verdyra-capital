import { Resend } from "resend";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getResendClient(): Resend {
  return new Resend(getRequiredEnv("RESEND_API_KEY"));
}

function getFromEmail(): string {
  return getRequiredEnv("RESEND_FROM_EMAIL");
}

export async function sendPasswordResetEmail(
  to: string,
  resetLink: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const from = getFromEmail();

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: "Reset your Verdyra Capital password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F6F8F7;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <tr>
                <td>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #0F5A3A; padding: 32px; text-align: center;">
                        <p style="margin: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; color: #D4AF37; text-transform: uppercase;">Verdyra Capital</p>
                        <h1 style="margin: 12px 0 0; font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.3;">Reset Your Password</h1>
                      </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px 32px;">
                        <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #111111;">A password reset was requested for your Verdyra Capital Customer Portal account.</p>
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #111111;">Click the button below to set a new password. This link will expire in 1 hour.</p>
                        <!-- CTA Button -->
                        <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 32px;">
                          <tr>
                            <td style="border-radius: 8px; background-color: #0F5A3A;" align="center">
                              <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">Reset Password</a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.6; color: #64748B;">If the button above doesn't work, copy and paste this link into your browser:</p>
                        <p style="margin: 0 0 24px; font-size: 13px; line-height: 1.6; color: #0F5A3A; word-break: break-all; background-color: #F0FDF4; padding: 12px; border-radius: 8px; border: 1px solid #BBF7D0;">${resetLink}</p>
                        <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748B;">If you did not request this, you can safely ignore this email. Your password will not be changed.</p>
                        <p style="margin: 16px 0 0; font-size: 14px; line-height: 1.6; color: #64748B;">For security, this link can only be used once.</p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #F8FAF9; padding: 24px 32px; text-align: center; border-top: 1px solid #E2E8F0;">
                        <p style="margin: 0 0 8px; font-size: 12px; color: #94A3B8;">&copy; ${new Date().getFullYear()} Verdyra Capital. All rights reserved.</p>
                        <p style="margin: 0; font-size: 12px; color: #94A3B8;">This is an automated message. Please do not reply.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend send error:", { message: error.message });
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const errorInfo = err as { message?: string } | null;
    console.error("sendPasswordResetEmail failed:", { message: errorInfo?.message ?? "Unknown error" });
    return { success: false, error: errorInfo?.message ?? "Unknown error" };
  }
}
export async function sendWelcomeEmail(
  to: string,
  customerName: string,
  username: string,
  password: string,
  portalUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const from = getFromEmail();

    const { error } = await resend.emails.send({
      from,
      to,
      subject: "Welcome to Verdyra Capital — Let’s Get You Funded 🚀",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>

          <body style="margin:0;padding:0;background-color:#F6F8F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;padding:32px 16px;">
              <tr>
                <td>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                    style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                      <td style="background:#0F5A3A;padding:32px;text-align:center;">
                        <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.12em;color:#D4AF37;text-transform:uppercase;">
                          Verdyra Capital
                        </p>

                        <h1 style="margin:12px 0 0;font-size:28px;line-height:1.3;color:#ffffff;">
                          Welcome Aboard! 🚀
                        </h1>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding:36px 28px;">

                        <p style="margin:0 0 18px;font-size:17px;line-height:1.6;color:#111111;">
                          Dear ${customerName},
                        </p>

                        <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#111111;">
                          Welcome to <strong>Verdyra Capital!</strong> 🎉
                        </p>

                        <p style="margin:0 0 8px;font-size:21px;line-height:1.4;font-weight:700;color:#0F5A3A;">
                          Let’s get you funded in the next 2 days 🚀
                        </p>

                        <p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#334155;">
                          Upload your documents today, and we’ll take it forward.
                        </p>

                        <!-- Login Details -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                          style="background:#F0FDF4;border:1px solid #D4AF37;border-radius:12px;margin-bottom:28px;">

                          <tr>
                            <td style="padding:20px;">

                              <p style="margin:0 0 14px;font-size:15px;font-weight:700;color:#0F5A3A;">
                                YOUR VERDYRA CAPITAL PORTAL
                              </p>

                              <p style="margin:0 0 10px;font-size:14px;color:#475569;">
                                <strong>Portal:</strong>
                                <a href="${portalUrl}" target="_blank" style="color:#0F5A3A;word-break:break-all;">
                                  ${portalUrl}
                                </a>
                              </p>

                              <p style="margin:0 0 10px;font-size:14px;color:#475569;">
                                <strong>Login ID:</strong> ${username}
                              </p>

                              <p style="margin:0;font-size:14px;color:#475569;">
                                <strong>Password:</strong> ${password}
                              </p>

                            </td>
                          </tr>
                        </table>

                        <!-- CTA -->
                        <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 30px;">
                          <tr>
                            <td style="border-radius:8px;background:#0F5A3A;text-align:center;">
                              <a
                                href="${portalUrl}"
                                target="_blank"
                                style="display:inline-block;padding:15px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;"
                              >
                                ACCESS MY VERDYRA PORTAL →
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p style="margin:0 0 14px;font-size:16px;font-weight:700;color:#111111;">
                          Your next step is simple
                        </p>

                        <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#475569;">
                          Log in to your portal and upload the available business documents.
                        </p>

                        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">
                          You can also download, complete and upload the required
                          <strong>Debt Profile</strong> and <strong>MIS</strong> templates directly from the portal.
                        </p>

                        <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#475569;">
                          Once your documents are uploaded, our team will review them and take the application forward.
                        </p>

                        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">
                          If you need any help, simply reach out to your Relationship Manager.
                        </p>

                        <p style="margin:0;font-size:17px;font-weight:700;color:#0F5A3A;">
                          Let’s get your business moving. 🚀
                        </p>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background:#F8FAF9;padding:24px 28px;text-align:center;border-top:1px solid #E2E8F0;">

                        <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0F5A3A;">
                          Team Verdyra Capital
                        </p>

                        <p style="margin:0 0 10px;font-size:12px;color:#64748B;">
                          Powering Business Growth Through Smarter Capital
                        </p>

                        <p style="margin:0;font-size:11px;color:#94A3B8;">
                          © ${new Date().getFullYear()} Verdyra Capital. All rights reserved.
                        </p>

                      </td>
                    </tr>

                  </table>

                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Welcome email send error:", {
        message: error.message,
      });

      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (err) {
    const errorInfo = err as { message?: string } | null;

    console.error("sendWelcomeEmail failed:", {
      message: errorInfo?.message ?? "Unknown error",
    });

    return {
      success: false,
      error: errorInfo?.message ?? "Unknown error",
    };
  }
}
export async function sendAdminWelcomeEmail(
  to: string,
  adminName: string,
  username: string,
  password: string,
  adminUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const from = getFromEmail();

    const { error } = await resend.emails.send({
      from,
      to,
      subject: "Welcome to Verdyra Capital — Admin Account Created",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>

          <body style="margin:0;padding:0;background-color:#F6F8F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;padding:32px 16px;">
              <tr>
                <td>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                    style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

                    <tr>
                      <td style="background:#0F5A3A;padding:32px;text-align:center;">
                        <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.12em;color:#D4AF37;text-transform:uppercase;">
                          Verdyra Capital
                        </p>

                        <h1 style="margin:12px 0 0;font-size:28px;line-height:1.3;color:#ffffff;">
                          Welcome to the Team
                        </h1>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:36px 28px;">

                        <p style="margin:0 0 18px;font-size:17px;line-height:1.6;color:#111111;">
                          Dear ${adminName},
                        </p>

                        <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#334155;">
                          Your <strong>Verdyra Capital Admin Portal</strong> account has been created successfully.
                        </p>

                        <p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#334155;">
                          You can now access the Admin Portal using the credentials below.
                        </p>

                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                          style="background:#F0FDF4;border:1px solid #D4AF37;border-radius:12px;margin-bottom:28px;">

                          <tr>
                            <td style="padding:20px;">

                              <p style="margin:0 0 14px;font-size:15px;font-weight:700;color:#0F5A3A;">
                                YOUR ADMIN PORTAL
                              </p>

                              <p style="margin:0 0 10px;font-size:14px;color:#475569;">
                                <strong>Portal:</strong>
                                <a href="${adminUrl}" target="_blank" style="color:#0F5A3A;word-break:break-all;">
                                  ${adminUrl}
                                </a>
                              </p>

                              <p style="margin:0 0 10px;font-size:14px;color:#475569;">
                                <strong>Login ID:</strong> ${username}
                              </p>

                              <p style="margin:0;font-size:14px;color:#475569;">
                                <strong>Temporary Password:</strong> ${password}
                              </p>

                            </td>
                          </tr>
                        </table>

                        <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 30px;">
                          <tr>
                            <td style="border-radius:8px;background:#0F5A3A;text-align:center;">
                              <a
                                href="${adminUrl}"
                                target="_blank"
                                style="display:inline-block;padding:15px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;"
                              >
                                Open Admin Portal
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#64748B;">
                          For security, please change your password after your first login.
                        </p>

                        <p style="margin:0;font-size:14px;line-height:1.6;color:#64748B;">
                          If you were not expecting this account, please contact the Verdyra Capital Super Administrator.
                        </p>

                      </td>
                    </tr>

                    <tr>
                      <td style="background:#F8FAF9;padding:24px 32px;text-align:center;border-top:1px solid #E2E8F0;">
                        <p style="margin:0 0 8px;font-size:12px;color:#94A3B8;">
                          &copy; ${new Date().getFullYear()} Verdyra Capital. All rights reserved.
                        </p>

                        <p style="margin:0;font-size:12px;color:#94A3B8;">
                          This is an automated message. Please do not reply.
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Admin welcome email failed:", {
        message: error.message,
      });

      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (err) {
    const errorInfo = err as { message?: string } | null;

    console.error("sendAdminWelcomeEmail failed:", {
      message: errorInfo?.message ?? "Unknown error",
    });

    return {
      success: false,
      error: errorInfo?.message ?? "Unknown error",
    };
  }
}

export async function sendMerchantAssignmentEmail(
  to: string,
  adminName: string,
  merchantNames: string[],
  adminUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const from = getFromEmail();

    const merchantCount = merchantNames.length;

    const merchantList = merchantNames
      .map(
        (name) =>
          `<li style="margin:0 0 8px;color:#334155;">${name}</li>`
      )
      .join("");

    const { error } = await resend.emails.send({
      from,
      to,
      subject: "New Merchants Assigned to Your Verdyra Account",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </head>

          <body
            style="margin:0;padding:0;background-color:#F6F8F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;"
          >
            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              style="max-width:600px;margin:0 auto;padding:32px 16px;"
            >
              <tr>
                <td>
                  <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);"
                  >
                    <tr>
                      <td
                        style="background:#0F5A3A;padding:32px;text-align:center;"
                      >
                        <p
                          style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.12em;color:#D4AF37;text-transform:uppercase;"
                        >
                          Verdyra Capital
                        </p>

                        <h1
                          style="margin:12px 0 0;font-size:28px;line-height:1.3;color:#ffffff;"
                        >
                          New Merchant Assignment
                        </h1>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:36px 28px;">
                        <p
                          style="margin:0 0 18px;font-size:17px;line-height:1.6;color:#111111;"
                        >
                          Dear ${adminName},
                        </p>

                        <p
                          style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#334155;"
                        >
                          ${merchantCount}
                          ${
                            merchantCount === 1
                              ? "merchant has"
                              : "merchants have"
                          }
                          been assigned to your
                          <strong>Verdyra Capital Admin Portal</strong>
                          account.
                        </p>

                        <p
                          style="margin:0 0 14px;font-size:16px;font-weight:700;color:#0F5A3A;"
                        >
                          Assigned Merchants
                        </p>

                        <ul
                          style="margin:0 0 28px;padding-left:22px;font-size:15px;line-height:1.6;"
                        >
                          ${merchantList}
                        </ul>

                        <table
                          role="presentation"
                          cellspacing="0"
                          cellpadding="0"
                          style="margin:0 auto 30px;"
                        >
                          <tr>
                            <td
                              style="border-radius:8px;background:#0F5A3A;text-align:center;"
                            >
                              <a
                                href="${adminUrl}"
                                target="_blank"
                                style="display:inline-block;padding:15px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;"
                              >
                                Open Admin Portal
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p
                          style="margin:0;font-size:14px;line-height:1.6;color:#64748B;"
                        >
                          If you were not expecting this assignment,
                          please contact the Verdyra Capital Super Administrator.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="background:#F8FAF9;padding:24px 32px;text-align:center;border-top:1px solid #E2E8F0;"
                      >
                        <p
                          style="margin:0 0 8px;font-size:12px;color:#94A3B8;"
                        >
                          &copy; ${new Date().getFullYear()}
                          Verdyra Capital. All rights reserved.
                        </p>

                        <p
                          style="margin:0;font-size:12px;color:#94A3B8;"
                        >
                          This is an automated message. Please do not reply.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Merchant assignment email failed:", {
        message: error.message,
      });

      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (err) {
    const errorInfo = err as { message?: string } | null;

    console.error("sendMerchantAssignmentEmail failed:", {
      message: errorInfo?.message ?? "Unknown error",
    });

    return {
      success: false,
      error: errorInfo?.message ?? "Unknown error",
    };
  }
}
