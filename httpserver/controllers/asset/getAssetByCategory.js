export default async function getAssetByCategory(req,res){
    try {
        const {category} = req.params;
        const assets = await prisma.asset.findMany({
            where:{
                AssetCategory:category
            }
        })
        return res.status(200).json({
            message:"Assets fetched successfully",
            success:true,
            assets
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}
