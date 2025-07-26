import { Request, Response } from 'express';
import assetService from "../../services/asset.service.js";
import replaceTokens from "../auth/replaceTokens.js";

interface AuthenticatedRequest extends Request {
  user?: string; // Assuming userId is a string
}

export default async function getUserAssets(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(200).json({
        message: "Un authorized user",
        success: false,
      });
    }
    
    const assets = await assetService.getUserAssets(userId);
    
    const updatedRes = replaceTokens(req, res);
    
    return updatedRes.status(200).json({
      message: "Assets fetched successfully",
      success: true,
      userAssets: assets,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
}