import { Request, Response } from 'express';
import authService from "../../services/auth.service";

interface AuthenticatedRequest extends Request {
  user?: string; // Assuming userId is a string
}

export default async function logout(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Missing user ID in request", success: false });
    }

    await authService.logoutUser(userId);

    return res
      .clearCookie("NexoraAccessToken", { sameSite: "None", secure: true })
      .clearCookie("NexoraRefreshToken", { sameSite: "None", secure: true })
      .status(200)
      .json({ message: "Signed out successfully", success: true });
  } catch (error: any) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
}