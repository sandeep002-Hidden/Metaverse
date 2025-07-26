import { Request, Response } from 'express';
import assetService from "../../services/asset.service.js";
import replaceTokens from "../auth/replaceTokens.js";

interface AuthenticatedRequest extends Request {
  user?: string; // Assuming userId is a string
}

export default async function createAsset(req: AuthenticatedRequest, res: Response) {
  try {
    const { shapeName, shapeStatus, properties, shapeCategory } = req.body;
    const userId = req.user; // or req.user.id, depending on your auth middleware

    const asset = await assetService.createAsset(shapeName, shapeStatus, properties, shapeCategory, userId);

    const updatedRes = replaceTokens(req, res);
    return updatedRes.status(200).json({
      message: "Asset created successfully",
      success: true,
      _id: asset.id,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
}