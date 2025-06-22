
import replaceTokens from "../auth/replaceTokens.js";

export default async function find(req,res) {
    try {
        console.log(req.body)
        const {type,id}=req.body;
        const updatedRes = replaceTokens(req, res);

        if(!type||!id){
            return updatedRes.status(200).json({
                message:"Both type and Id are required",
                success:false
            })
        }
        console.log(type,id)
            return updatedRes.status(200).json({
                message:"success",
                success:true
            });
    } catch (error) {
        return res.status(200).json({
            message:error.message,
            success:false
        })
    }
}