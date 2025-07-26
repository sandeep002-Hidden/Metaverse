import { Request, Response } from 'express';
import authService from "../../services/auth.service";

export default async function verifyOtp(req: Request, res: Response) {
  try {
    const { emailOrUserName, otp } = req.body;
    await authService.verifyOtp(emailOrUserName, otp);
    return res
      .status(200)
      .json({ message: "User Verified Successfully", success: true });
  } catch (error: any) {
    return res.status(500).json({ message: error.message, success: false });
  }
}