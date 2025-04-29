export default async function getAllAssets(req,res){
    try {
        const assets = await prisma.asset.findMany();
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
