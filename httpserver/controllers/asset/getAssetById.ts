import { Request, Response } from 'express';
import assetService from "../../services/asset.service.js";

export default async function getAssetById(req: Request, res: Response){
    try {
        const {assetId} = req.params;
        const asset = await assetService.getAssetById(assetId);
        return res.status(200).json({
            message:"Asset fetched successfully",
            success:true,
            asset
        })
    } catch (error: any) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}