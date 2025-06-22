import prisma from "../../prisma/prisma.js";
import replaceTokens from "../auth/replaceTokens.js";

export default async function createAsset(req, res) {
  try {
    const { shapeName, shapeStatus, properties, shapeCategory } = req.body;
    const userId = req.user; // or req.user.id, depending on your auth middleware

    // create the shape and attach CreatorId
    const asset = await prisma.shape.create({
      data: {
        ShapeName:       shapeName,
        CreatorId:       userId,
        AccessSpecifier: shapeStatus === "Public" ? "PUBLIC" : "PRIVATE",
        Category:        shapeCategory,
        Properties:      JSON.parse(properties),
      },
    });

    // connect the new shape to the user's Shapes[]
    await prisma.user.update({
      where: { id: userId },
      data: {
        Shapes: {
          connect: { id: asset.id }
        },
      },
    });

    const updatedRes = replaceTokens(req, res);
    return updatedRes.status(200).json({
      message: "Asset created successfully",
      success: true,
      _id: asset.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
}
