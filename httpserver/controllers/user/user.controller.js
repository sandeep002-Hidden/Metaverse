import jwt from "jsonwebtoken";
import prisma from "../../prisma/prisma.js";
import replaceTokens from "../auth/replaceTokens.js";

const getuserdetails = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    const sendUser = {
      id: user.id,
      profilePic: user.ProfilePicture,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Email: user.Email,
      UserName: user.UserName,
    };

    // Set new cookies if tokens were refreshed
    const updatedRes = replaceTokens(req, res);

    const response = {
      message: "User details retrieved successfully",
      success: true,
      user: sendUser,
    };
    return updatedRes.status(200).json(response);
  } catch (error) {
    console.log("Error in getUserDetails:", error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

const search = async (req, res) => {
  try {
    const query = req.params.query;

    // Search for users matching the query in username, first name, or last name
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

    // Search for worlds/maps matching the query
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

    // Format worlds to include like count

    const updatedRes = replaceTokens(req, res);
    const response = {
      message: `Results for query "${query}"`,
      success: true,

      users,
      shapes,
      worlds: worlds,
      counts: {
        users: users.length,
        shapes: shapes.length,
        worlds: worlds.length,
        total: users.length + shapes.length + worlds.length,
      },
    };

    return updatedRes.status(200).json(response);
  } catch (error) {
    console.log("Error in search function:", error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export { getuserdetails, search };
