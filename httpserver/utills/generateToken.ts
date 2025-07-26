import prisma from "../prisma/prisma";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  Email: string;
  UserName: string;
}

interface TokenResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
}

const generateAccessToken = async (user: UserPayload): Promise<string> => {
  return jwt.sign(
    {
      id: user.id,
      Email: user.Email,
      UserName: user.UserName,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const generateRefreshToken = async (user: { id: string }): Promise<string> => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const generateAccessAndRefreshToken = async (userId: string): Promise<TokenResponse> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return {
        success: false,
        message: "No user Exists",
      };
    }
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    await prisma.user.update({
      where: { id: userId },
      data: { RefreshToken: refreshToken },
    });
    return { accessToken, refreshToken, success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

const refreshAccessToken = async (oldRefreshToken: string): Promise<TokenResponse> => {
  try {
    if (!oldRefreshToken) {
      console.log("No refresh token provided");
      return {
        success: false,
        message: "Refresh token is required",
      };
    }
    const decodedToken: any = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
      select: {
        id: true,
        RefreshToken: true,
      },
    });
    console.log("no user")
    if (!user) {
      return {
        success: false,
        message: "User no longer exists",
      };
    }

    if (oldRefreshToken !== user.RefreshToken) {
      console.log('Token mismatch for user');
      return {
        success: false,
        message: "Invalid refresh token",
      };
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user.id
    );
    if (!accessToken || !refreshToken) {
      return {
        success: false,
        message: "Error generating new tokens",
      };
    }
    return {
      accessToken,
      refreshToken,
      success: true,
    };
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        success: false,
        message: "Refresh token has expired. Please login again",
      };
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return {
        success: false,
        message: "Invalid refresh token. Please login again",
      };
    }

    return {
      success: false,
      message: "An error occurred while refreshing tokens",
    };
  }
};

export { refreshAccessToken, generateAccessAndRefreshToken };