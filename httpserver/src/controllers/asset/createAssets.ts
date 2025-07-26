import { Request, Response } from "express";
import AssetService from "../../services/asset.service";
import replaceTokens from "../auth/replaceTokens";

interface AuthenticatedRequest extends Request {
  user?: string; // Assuming userId is a string
}

export default async function createAsset(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { shapeName, shapeStatus, properties, shapeCategory } = req.body;
    const userId = req.user; // or req.user.id, depending on your auth middleware
    if (!userId) {
      return res.status(200).json({
        message: "User Not Found",
        success: false,
      });
    }
    const asset = await AssetService.createAsset(
      shapeName,
      shapeStatus,
      properties,
      shapeCategory,
      userId
    );

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
