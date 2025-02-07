import prisma from "../../prisma/prisma.js";
import sendEmail from "../../utills/NodeMailer.js";
export default async function forgotPasswordEmail(req, res) {
  try {
    console.log(req.body)
    const { emailOrUserName } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ Email: emailOrUserName }, { UserName: emailOrUserName }],
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "User with given credential doesnot exists",
        success: false,
      });
    }
    const currentDate = new Date(Date.now());
    if (user.Otp && user.OtpExpire > currentDate) {
      return res
        .status(201)
        .json({
          message: "email already send, try again after some time",
          success: false,
        });
    }
    const emailResponse = await sendEmail(user.Email, "Change Password");
    if (!emailResponse.success) {
      return res
        .status(500)
        .json({ message: "Error ocure while sending email", success: flase });
    }
    const sentOtp = emailResponse.otp;
    await prisma.user.update({
      where: { d: user.d },
      data: {
        Otp: parseInt(sentOtp),
        OtpExpire: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    return res
      .status(200)
      .json({ message: "Email Send successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: error.message, success: false });
  }
}
