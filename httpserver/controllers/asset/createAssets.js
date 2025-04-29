export default async function createAsset(req,res){
    try {
        const {AssetName,AssetStatus,AssetCategory} = req.body;
        const asset = await prisma.asset.create({
            data:{
                AssetName,
                AssetStatus,
                AssetCategory
            }
        })
        return res.status(200).json({
            message:"Asset created successfully",
            success:true,
            id:asset.id
        })

    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}
