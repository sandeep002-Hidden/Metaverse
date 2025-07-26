import { Request, Response } from 'express';
import authService from "../../services/auth";
import { generateAccessAndRefreshToken } from "../../utills/generateToken";

export default async function loginUser(req: Request, res: Response) {
  try {
    const { cred, password } = req.body;
    if (!cred || !password) {
      return res.status(400).json({
        message: "Email/Username and password are required.",
        success: false,
      });
    }
    
    const existingUser = await authService.loginUser(cred, password);

    const tokens = await generateAccessAndRefreshToken(existingUser.id);

    if (!tokens.success) {
      return res.status(500).json({
        message: tokens.message,
        success: false,
        d: existingUser.d,
      });
    }

    const { accessToken, refreshToken } = tokens;

    return res
      .status(200)
      .cookie("NexoraAccessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
        maxAge: 60 * 60 * 1000, 
      })
      .cookie("NexoraRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
        maxAge: 15 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login Successful",
        success: true,
      });
  } catch (error: any) {
    console.log(error.message)
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}