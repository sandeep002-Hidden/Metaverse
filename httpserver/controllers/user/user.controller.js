import jwt from "jsonwebtoken";
import prisma from "../../prisma/prisma.js";

const getuserdetails = async (req, res) => {
  try {
    const userId = req.user;
    // console.log("User ID from request:", userId);
    // console.log("Access token from request:", req.accessToken ? "Present" : "Not present");
    // console.log("Refresh token from request:", req.refreshToken ? "Present" : "Not present");
    
    if (!userId) {
      // console.log("User ID not found in request");
      return res.status(401).json({ message: "User not found", success: false });
    }
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      // console.log("User not found in database");
      return res.status(401).json({ message: "User not found", success: false });
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
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: req.accessToken ? 3600000 : undefined // 1 hour for access token
    };
    
    const refreshCookieOptions = {
      ...cookieOptions,
      maxAge: req.refreshToken ? 7 * 24 * 3600000 : undefined // 7 days for refresh token
    };
    
    if (req.accessToken) {
      res.cookie("NexoraAccessToken", req.accessToken, cookieOptions);
      // console.log("New access token cookie set");
    }
    
    if (req.refreshToken) {
      res.cookie("NexoraRefreshToken", req.refreshToken, refreshCookieOptions);
      // console.log("New refresh token cookie set");
    }
    
    const response = {
      message: "User details retrieved successfully",
      success: true,
      user: sendUser
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log("Error in getUserDetails:", error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export { getuserdetails };