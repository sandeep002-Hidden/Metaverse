import { Request, Response } from 'express';
import assetService from "../../services/asset.service.js";

export default async function deleteAsset(req: Request, res: Response){
    try {
        const assetId = req.params.assetId;
        const asset = await assetService.deleteAsset(assetId);
        return res.status(200).json({
            message:"Asset deleted successfully",
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