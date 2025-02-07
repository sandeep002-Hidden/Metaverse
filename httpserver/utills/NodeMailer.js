import nodemailer from "nodemailer";

export default async function sendEmail(recipientEmail,subject) {
  try {
    const max = 999999;
    const min = 100000;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`Generated OTP: ${otp}`);

    const myMail = process.env.EMAIL;
    const myPass = process.env.EMAILPASS;

    if (!myMail || !myPass) {
      throw new Error("Email or Password not set in environment variables.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: myMail,
        pass: myPass,
      },
    });

    await transporter.verify(function (error, success) {
        if (error) {
          console.log("Transporter setup error:", error);
        } 
      });
      

    const mailOptions = {
      from: myMail,
      to: recipientEmail,
      subject: subject,
      text: `Your OTP is ${otp}`,
    };

    await transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            throw new Error("Error occure while sending email ")
        }
    });
    return { success: true, otp };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}
