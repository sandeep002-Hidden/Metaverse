import { Request, Response } from 'express';
import assetService from "../../services/asset.service.js";

export default async function getAssetByCategory(req: Request, res: Response){
    try {
        const {category} = req.params;
        const assets = await assetService.getAssetByCategory(category);
        return res.status(200).json({
            message:"Assets fetched successfully",
            success:true,
            assets
        })
    } catch (error: any) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}