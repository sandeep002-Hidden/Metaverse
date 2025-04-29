export default async function updateAsset(req,res){
    try {
        const assetId = req.params.assetId;
        const {AssetName,AssetStatus,AssetCategory} = req.body;
        const asset = await prisma.asset.update({
            where:{
                id:assetId
            }
        })
        return res.status(200).json({
            message:"Asset updated successfully",
            success:true,
            asset
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}
