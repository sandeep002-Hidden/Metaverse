import { Request, Response } from 'express';
import authService from "../../services/auth.service.js";

export default async function saveNewPassword(req: Request, res: Response) {
  try {
    const { emailOrUserName, password } = req.body;
    await authService.saveNewPassword(emailOrUserName, password);
    return res
      .status(200)
      .json({ message: "password changed successfully", success: true });
  } catch (error: any) {
    return res.status(500).json({ message: error.message, success: false });
  }
}