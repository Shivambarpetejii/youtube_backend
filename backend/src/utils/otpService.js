import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail', // or another provider like 'SendGrid'
  auth: {
    user: 'shivradha13@gmail.com',
    pass:'wzynubvgwnpgjplv',
  }
});

export const sendOtpToEmail = async (email, otp) => {
  const mailOptions = {
    from: 'shivradha13@gmail.com',
    to: email,
    subject: 'Your OTP for Password Change',
    text: `Your OTP for changing your password is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};
