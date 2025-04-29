export default async function getAssetById(req,res){
    try {
        const {assetId} = req.params;
        const asset = await prisma.asset.findUnique({
            where:{
                id:assetId
            }
        })
        return res.status(200).json({
            message:"Asset fetched successfully",
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
