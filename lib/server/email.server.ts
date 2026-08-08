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