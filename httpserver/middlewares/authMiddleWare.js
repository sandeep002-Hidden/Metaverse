import jwt from "jsonwebtoken";
import { refreshAccessToken } from "../utills/generateToken.js";

export default async function middleware(req, res, next) {
  try {
    const accessToken = req.cookies.NexoraAccessToken;
    const refreshToken = req.cookies.NexoraRefreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({
        message: "No token, authorization denied",
        success: false,
      });
    }

    if (refreshToken && !accessToken) {
      try {
        const tokens = await refreshAccessToken(refreshToken);
        if (!tokens.success) {
          return res.status(401).json({
            message: tokens.message,
            success: false,
          });
        }
        console.log("tokens")
        res.cookie("NexoraAccessToken", tokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        res.cookie("NexoraRefreshToken", tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        const decoded = jwt.verify(
          tokens.accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        req.user = decoded.user;

        return next();
      } catch (error) {
        return res.status(401).json({
          message: "Error refreshing token",
          success: false,
          error: error.message,
        });
      }
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded.user;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError" && refreshToken) {
        try {
          const tokens = await refreshAccessToken(refreshToken);

          if (!tokens.success) {
            return res.status(401).json({
              message: "Error occurred while refreshing the token",
              success: false,
            });
          }

          res.cookie("NexoraAccessToken", tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });

          res.cookie("NexoraRefreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });

          const decoded = jwt.verify(
            tokens.accessToken,
            process.env.ACCESS_TOKEN_SECRET
          );
          req.user = decoded.user;

          return next();
        } catch (refreshError) {
          return res.status(401).json({
            message: "Error refreshing token",
            success: false,
            error: refreshError.message,
          });
        }
      }

      return res.status(401).json({
        message: "Invalid token",
        success: false,
        error: error.message,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Server error in authentication",
      success: false,
      error: err.message,
    });
  }
}
