import prisma from "../../prisma/prisma.js"
import replaceTokens from "../auth/replaceTokens.js";
export default async function createAsset(req,res){
    try {
        const {shapeName,shapeStatus,properties,shapeCategory} = req.body;
        const user=req.user
        console.log(properties)
        const asset = await prisma.shape.create({
            data:{
                ShapeName:shapeName,
                CreatorId:user,
                AccessSpecifier:shapeStatus==="Public"?"PUBLIC":"PRIVATE",
                Category:shapeCategory,
                Properties:JSON.parse(properties)
            }
        })
        const updatedRes=replaceTokens(req,res)
        return updatedRes.status(200).json({
            message:"Asset created successfully",
            success:true,
            _id:asset.id
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}
