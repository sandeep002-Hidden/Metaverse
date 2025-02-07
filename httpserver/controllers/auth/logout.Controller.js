import prisma from "../../prisma/prisma.js";
import jwt from "jsonwebtoken";
export default async function logout(req, res) {
  try {
    const accessToken = req.cookies.NexoraAccessToken;
    // console.log(req.cookies)
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decoded)
    if (!decoded) {
      return res.status(403).json({
        message: "something went wrong, try again after sometime",
        success: flase,
      });
    }
    // console.log(decoded)
    const userId = decoded.id;
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
