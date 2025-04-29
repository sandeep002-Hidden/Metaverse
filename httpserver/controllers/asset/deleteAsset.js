export default async function deleteAsset(req,res){
    try {
        const assetId = req.params.assetId;
        const asset = await prisma.asset.delete({
            where:{
                id:assetId
            }
        })
        return res.status(200).json({
            message:"Asset deleted successfully",
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
