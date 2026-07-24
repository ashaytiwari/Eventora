import nodemailer from "nodemailer";

export async function sendEmail({ emailTo, subject, html }: any) {
  try {

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });

    const mailOptions = {
      from: "Eventora Team | contact@eventora.com",
      to: emailTo,
      subject,
      html
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;

  } catch (error: any) {
    console.log('Something went wrong while sending email', error);
  }

}