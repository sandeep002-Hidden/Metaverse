import prisma from "../../prisma/prisma.js";
import jwt from "jsonwebtoken";

export default async function logout(req, res) {
  try {
    // Assuming your auth middleware attaches the full user object to req.user:
    const userId = req.user;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Missing user ID in request", success: false });
    }

    // Clear the stored refresh token
    await prisma.user.update({
      where: { id: userId },
      data: { RefreshToken: "" },
    });

    // Clear cookies and respond
    return res
      .clearCookie("NexoraAccessToken", { sameSite: "None", secure: true })
      .clearCookie("NexoraRefreshToken", { sameSite: "None", secure: true })
      .status(200)
      .json({ message: "Signed out successfully", success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
}
