import { Request, Response } from 'express';
import assetService from "../../services/asset.service.js";

export default async function getAllAssets(req: Request, res: Response){
    try {
        const assets = await assetService.getAllAssets();
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