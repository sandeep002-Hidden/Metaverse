import prisma from "../../prisma/prisma.js";
export default async function verifyOtp(req, res) {
  try {
    const { emailOrUserName, otp } = req.body;
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
    if(!user.Otp){
        return res.status(401).json({message:"no otp sent ,try again",success:false})
    }
    if (user.Otp != otp) {
      return res.status(401).json({ message: "Wrong Otp", success: false });
    }
    const currentDate = new Date(Date.now());
    if (user.OtpExpire < currentDate) {
      return res.status(401).json({ message: "Otp Expired", success: false });
    }
    await prisma.user.update({
        where:{id:user.id},
        data:{Otp:null,OtpExpire:null}
    })
    return res
      .status(200)
      .json({ message: "User Verified Successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}
