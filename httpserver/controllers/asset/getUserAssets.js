export default async function getUserAssets(req,res){
    try {
        const userId = req.userId;
        const assets = await prisma.asset.findMany({
            where:{
                userId
            }
        })
        return res.status(200).json({
            message:"Assets fetched successfully",
            success:true,
            userAssets: assets
        })
        

    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}
