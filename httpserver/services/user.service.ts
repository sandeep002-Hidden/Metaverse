import prisma from "../prisma/prisma.js";

interface User {
  id: string;
  ProfilePicture: string | null;
  FirstName: string;
  LastName: string;
  Email: string;
  UserName: string;
}

interface Shape {
  ShapeName: string;
  CreatorId: string;
}

interface World {
  WorldName: string;
  WorldDescription: string | null;
  AccessSpecifier: string;
}

class UserService {
  async getUserDetails(userId: string): Promise<User> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }
    return {
      id: user.id,
      profilePic: user.ProfilePicture,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Email: user.Email,
      UserName: user.UserName,
    };
  }

  async search(query: string): Promise<{ users: User[]; shapes: Shape[]; worlds: World[] }> {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { UserName: { contains: query, mode: "insensitive" } },
          { FirstName: { contains: query, mode: "insensitive" } },
          { LastName: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        ProfilePicture: true,
        FirstName: true,
        LastName: true,
        UserName: true,
      },
    });

    const shapes = await prisma.shape.findMany({
      where: {
        OR: [{ ShapeName: { contains: query, mode: "insensitive" } }],
      },
      select: {
        ShapeName:true,
        CreatorId:true,
      },
    });

    const worlds = await prisma.worlds.findMany({
      where: {
        OR: [{ WorldName: { contains: query, mode: "insensitive" } }],
      },
      select: {
        WorldName:true,
        WorldDescription:true,
        AccessSpecifier:true,
      },
    });

    return { users, shapes, worlds };
  }
}

export default new UserService();