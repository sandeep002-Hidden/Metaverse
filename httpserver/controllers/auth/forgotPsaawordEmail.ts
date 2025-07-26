import { Request, Response } from 'express';
import authService from "../../services/auth.service.js";

export default async function forgotPasswordEmail(req: Request, res: Response) {
  try {
    const { emailOrUserName } = req.body;
    await authService.forgotPasswordEmail(emailOrUserName);
    return res
      .status(200)
      .json({ message: "Email Send successfully", success: true });
  } catch (error: any) {
    console.log(error);
    return res.status(501).json({ message: error.message, success: false });
  }
}