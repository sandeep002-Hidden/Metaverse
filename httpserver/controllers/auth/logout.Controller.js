import prisma from "../../prisma/prisma.js";
import jwt from "jsonwebtoken";
export default async function logout(req, res) {
  try {
    // console.log("req",req)
    const userId = req.user;
    // console.log("userId",userId)
    const updateStatus = await prisma.user.update({
      where: { id: userId },
      data: { RefreshToken: "" },
    });

    return res
      .clearCookie("NexoraAccessToken", { sameSite: "None", secure: true })
      .clearCookie("NexoraRefreshToken", { sameSite: "None", secure: true })
      .status(200)
      .json({ message: "Signout user successfully", success: true });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}
