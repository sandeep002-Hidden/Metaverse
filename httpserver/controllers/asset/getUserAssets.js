import prisma from "../../prisma/prisma.js";
import replaceTokens from "../auth/replaceTokens.js";

export default async function getUserAssets(req, res) {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(200).json({
        message: "Un authorized user",
        success: false,
      });
    }
    
    const assets = await prisma.shape.findMany({
      where: {
        CreatorId: userId,
      },
    });
    
    // Use a different variable name for the result of replaceTokens
    const updatedRes = replaceTokens(req, res);
    
    return updatedRes.status(200).json({
      message: "Assets fetched successfully",
      success: true,
      userAssets: assets,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
}