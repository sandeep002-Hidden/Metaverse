import { Request, Response } from 'express';
import assetService from "../../services/asset.service";

export default async function updateAsset(req: Request, res: Response){
    try {
        const assetId = req.params.assetId;
        const {AssetName,AssetStatus,AssetCategory} = req.body;
        const asset = await assetService.updateAsset(assetId, AssetName, AssetStatus, AssetCategory);
        return res.status(200).json({
            message:"Asset updated successfully",
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