import { Request, Response } from 'express';
import authService from "../../services/auth.service";

interface RegisterRequest extends Request {
  file?: { path: string };
}

export default async function registerUser(req: RegisterRequest, res: Response) {
  try {
    const { FirstName, LastName, Email, UserName, Password } = req.body;
    if (!FirstName || !LastName || !Email || !UserName || !Password) {
      return res
        .status(400)
        .json({ message: "All the fields are required", success: false });
    }

    const profilePic = req.file?.path;

    const user = await authService.registerUser(FirstName, LastName, Email, UserName, Password, profilePic);

    res.status(201).json({
      message: "Registration successful",
      success: true,
      user: { id: user.id },
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Registration failed",
      message: error.message,
      success: false,
    });
  }
}