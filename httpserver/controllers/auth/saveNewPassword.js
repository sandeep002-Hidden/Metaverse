import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
function validatePassword(password) {
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  return passwordPattern.test(password);
}
export default async function saveNewPassword(req, res) {
  try {
    const { emailOrUserName, password } = req.body;
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
    const validatePasswordRes = validatePassword(password);
    if (!validatePasswordRes) {
      return res
        .status(406)
        .json({ message: "Enter a valid password", success: false });
    }
    const comp = await bcrypt.compare(password, user.Password);
    if (comp) {
      return res
        .status(406)
        .json({
          message: "new password cannot be same as old Password",
          success: false,
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { Password: hashedPassword },
    });
    return res
      .status(200)
      .json({ message: "password changed successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}
