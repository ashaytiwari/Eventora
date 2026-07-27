export function resetPasswordTemplate({ firstName, resetPasswordURL }: any) {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:40px 0;">
    <tr>
      <td align="center">

        <table role="presentation"
               width="600"
               cellspacing="0"
               cellpadding="0"
               style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center"
                style="background:#5dfeca;padding:30px 20px;">
              <h1 style="margin:0;color:#1f2937;font-size:28px;">
                Eventora
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 35px;color:#374151;">

              <h2 style="margin-top:0;">
                Reset Your Password
              </h2>

              <p style="font-size:16px;line-height:1.7;">
                Hi <strong>${firstName}</strong>,
              </p>

              <p style="font-size:16px;line-height:1.7;">
                We received a request to reset the password for your
                <strong>Eventora</strong> account.
              </p>

              <p style="font-size:16px;line-height:1.7;">
                Click the button below to create a new password.
              </p>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:35px auto;">
                <tr>
                  <td align="center"
                      bgcolor="#5dfeca"
                      style="border-radius:6px;">
                    <a href="${resetPasswordURL}"
                       style="display:inline-block;padding:14px 32px;font-size:16px;font-weight:bold;color:#1f2937;text-decoration:none;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:15px;line-height:1.7;">
                This password reset link will expire in
                <strong>60 Minutes</strong> for your security.
              </p>

              <p style="font-size:15px;line-height:1.7;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all;">
                <a href="${resetPasswordURL}"
                   style="color:#2563eb;text-decoration:none;">
                  ${resetPasswordURL}
                </a>
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:35px 0;" />

              <p style="font-size:14px;color:#6b7280;line-height:1.7;">
                <strong>Didn't request a password reset?</strong><br>
                You can safely ignore this email. Your password will remain unchanged unless you use the link above.
              </p>

              <p style="font-size:14px;color:#6b7280;line-height:1.7;">
                If you continue receiving password reset emails that you didn't request, we recommend reviewing your account security.
              </p>

              <p style="margin-bottom:0;font-size:16px;">
                Thanks,<br />
                <strong>The Eventora Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
                style="padding:25px;background:#f9fafb;color:#6b7280;font-size:13px;">
              © ${new Date().getFullYear()} Eventora. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}