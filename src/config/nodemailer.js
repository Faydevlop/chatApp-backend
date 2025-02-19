import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // replace with your email
    pass: process.env.EMAIL_PASS   // replace with your email password
  }
});


  const sendVerificationEmail = async (userEmail, otp) => {
    const mailOptions = {
      from: 'zenwrists@gmail.com',
      to: userEmail,
      subject: 'Account Verification',
      text: `Your OTP for account verification is: ${otp}`
    };
    console.log(otp);
    

    try {
      await transporter.sendMail(mailOptions);
      console.log('Verification email sent');
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error: error.message };
    }
  }


export default sendVerificationEmail 

