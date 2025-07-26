import prisma from "../prisma/prisma.js";

class AssetService {
  async createAsset(shapeName: string, shapeStatus: string, properties: string, shapeCategory: string, userId: string): Promise<any> {
    const asset = await prisma.shape.create({
      data: {
        ShapeName: shapeName,
        CreatorId: userId,
        AccessSpecifier: shapeStatus === "Public" ? "PUBLIC" : "PRIVATE",
        Category: shapeCategory,
        Properties: JSON.parse(properties),
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        Shapes: {
          connect: { id: asset.id }
        },
      },
    });

    return asset;
  }

  async getUserAssets(userId: string): Promise<any[]> {
    const assets = await prisma.shape.findMany({
      where: {
        CreatorId: userId,
      },
    });
    return assets;
  }

  async getAssetById(assetId: string): Promise<any> {
    const asset = await prisma.shape.findUnique({
      where: {
        id: assetId
      }
    });
    return asset;
  }

  async updateAsset(assetId: string, AssetName: string, AssetStatus: string, AssetCategory: string): Promise<any> {
    const asset = await prisma.shape.update({
      where: {
        id: assetId
      },
      data: {
        ShapeName: AssetName,
        AccessSpecifier: AssetStatus === "Public" ? "PUBLIC" : "PRIVATE",
        Category: AssetCategory,
      },
    });
    return asset;
  }

  async deleteAsset(assetId: string): Promise<any> {
    const asset = await prisma.shape.delete({
      where: {
        id: assetId
      }
    });
    return asset;
  }

  async getAssetByCategory(category: string): Promise<any[]> {
    const assets = await prisma.shape.findMany({
      where: {
        Category: category
      }
    });
    return assets;
  }

  async getAllAssets(): Promise<any[]> {
    const assets = await prisma.shape.findMany();
    return assets;
  }
}

export default new AssetService();