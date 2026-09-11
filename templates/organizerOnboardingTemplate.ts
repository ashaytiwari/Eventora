export function organizerOnboardingTemplate({
  firstName,
  lastName,
  email,
  organizationName,
  temporaryPassword,
  appURL
}: any) {

  return `html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to {{appName}}</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation"
         width="100%"
         cellspacing="0"
         cellpadding="0"
         style="background-color:#f4f7fb;padding:40px 0;">

    <tr>
      <td align="center">

        <!-- Main Container -->
        <table role="presentation"
               width="600"
               cellspacing="0"
               cellpadding="0"
               style="width:600px;max-width:100%;background-color:#ffffff;border-radius:10px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center"
                style="background-color:#5dfeca;padding:30px 20px;">

              <h1 style="margin:0;color:#1f2937;font-size:28px;font-weight:700;">
                Eventora
              </h1>

              <p style="margin:8px 0 0;color:#374151;font-size:14px;">
                Discover. Connect. Experience.
              </p>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 35px;color:#374151;">

              <h2 style="margin:0 0 20px;color:#1f2937;font-size:24px;">
                Welcome to Eventora!
              </h2>

              <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
                Hi <strong>${firstName} ${lastName}</strong>,
              </p>

              <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
                You have been onboarded as an
                <strong>Event Organizer</strong> by the Eventora administration team.
              </p>

              <p style="font-size:16px;line-height:1.7;margin:0 0 25px;">
                Your account has been created for
                <strong>${organizationName}</strong>.
                You can use the credentials below to access the application.
              </p>

              <!-- Account Details -->
              <table role="presentation"
                     width="100%"
                     cellspacing="0"
                     cellpadding="0"
                     style="background-color:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;margin:0 0 30px;">

                <tr>
                  <td style="padding:25px;">

                    <h3 style="margin:0 0 20px;color:#1f2937;font-size:18px;">
                      Your Account Details
                    </h3>

                    <table role="presentation"
                           width="100%"
                           cellspacing="0"
                           cellpadding="0">

                      <tr>
                        <td style="padding:8px 0;color:#6b7280;font-size:14px;width:40%;">
                          Name
                        </td>
                        <td style="padding:8px 0;color:#1f2937;font-size:15px;font-weight:600;">
                          ${firstName} ${lastName}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:8px 0;color:#6b7280;font-size:14px;">
                          Email
                        </td>
                        <td style="padding:8px 0;color:#1f2937;font-size:15px;">
                          ${email}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:8px 0;color:#6b7280;font-size:14px;">
                          Organization
                        </td>
                        <td style="padding:8px 0;color:#1f2937;font-size:15px;">
                          ${organizationName}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:8px 0;color:#6b7280;font-size:14px;">
                          Temporary Password
                        </td>
                        <td style="padding:8px 0;color:#1f2937;font-size:15px;font-weight:600;">
                          ${temporaryPassword}
                        </td>
                      </tr>

                    </table>

                  </td>
                </tr>

              </table>

              <!-- Login Button -->
              <table role="presentation"
                     cellspacing="0"
                     cellpadding="0"
                     align="center"
                     style="margin:30px auto;">

                <tr>
                  <td align="center"
                      bgcolor="#5dfeca"
                      style="border-radius:6px;">

                    <a href="${appURL}"
                       target="_blank"
                       style="display:inline-block;padding:14px 32px;font-size:16px;font-weight:bold;color:#1f2937;text-decoration:none;">
                      Access Eventora
                    </a>

                  </td>
                </tr>

              </table>

              <!-- Instructions -->
              <h3 style="margin:30px 0 15px;color:#1f2937;font-size:18px;">
                What you need to do
              </h3>

              <ol style="margin:0;padding-left:22px;color:#374151;font-size:15px;line-height:1.8;">

                <li>
                  Open the Eventora application using the button above.
                </li>

                <li>
                  Log in using your email address and temporary password provided in this email.
                </li>

                <li>
                  <strong>Change your temporary password immediately after logging in.</strong>
                </li>

              </ol>

              <!-- Security Notice -->
              <table role="presentation"
                     width="100%"
                     cellspacing="0"
                     cellpadding="0"
                     style="background-color:#fff8e1;border-left:4px solid #f59e0b;margin:30px 0 0;">

                <tr>
                  <td style="padding:15px 18px;">

                    <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">
                      <strong>Security reminder:</strong><br />
                      Your temporary password is confidential.
                      <strong>Do not share this password with anyone.</strong>
                      Eventora will never ask you to share your password with another person.
                    </p>

                  </td>
                </tr>

              </table>

              <p style="font-size:15px;line-height:1.7;margin:30px 0 0;">
                If you did not expect to receive this email or believe this account
                was created by mistake, please contact the Eventora administration team.
              </p>

              <p style="font-size:16px;line-height:1.7;margin:25px 0 0;">
                Welcome aboard!<br />
                <strong>The Eventora Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
                style="padding:25px;background-color:#f9fafb;color:#6b7280;font-size:13px;">

              <p style="margin:0 0 8px;">
                © ${new Date().getFullYear()} Eventora. All rights reserved.
              </p>

              <p style="margin:0;">
                This is an automated email. Please do not reply to this email.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>

  </table>

</body>
</html>
`
    ;
}