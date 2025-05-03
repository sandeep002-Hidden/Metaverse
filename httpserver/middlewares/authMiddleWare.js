import jwt from "jsonwebtoken";
import { refreshAccessToken } from "../utills/generateToken.js";

export default async function middleware(req, res, next) {
  try {
    const accessToken = req.cookies.NexoraAccessToken;
    const refreshToken = req.cookies.NexoraRefreshToken;
    // console.log("accesstoken",accessToken)
    // console.log("refreshtoken",refreshToken)
    // No tokens provided
    if (!accessToken && !refreshToken) {
      return res.status(401).json({
        message: "No token, authorization denied",
        success: false,
      });
    }
    
    // Only refresh token exists
    if (refreshToken && !accessToken) {
      try {
        const tokens = await refreshAccessToken(refreshToken);
        if (!tokens.success) {
          return res.status(401).json({
            message: tokens.message,
            success: false,
          });
        }
        
        console.log("Refreshed tokens from refresh-only flow:", tokens);
        req.accessToken = tokens.accessToken;
        req.refreshToken = tokens.refreshToken;
        
        const decoded = jwt.verify(
          tokens.accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        req.user = decoded.id;
        
        return next();
      } catch (error) {
        return res.status(401).json({
          message: "Error refreshing token",
          success: false,
          error: error.message,
        });
      }
    }
    
    // Access token exists, try to use it
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded.id;
      return next();
    } catch (error) {
      // Access token expired but refresh token exists
      if (error.name === "TokenExpiredError" && refreshToken) {
        try {
          const tokens = await refreshAccessToken(refreshToken);
          // console.log("Refreshed tokens after expired access token:", tokens);
          
          if (!tokens.success) {
            return res.status(401).json({
              message: tokens.message,
              success: false,
            });
          }
          
          req.accessToken = tokens.accessToken;
          req.refreshToken = tokens.refreshToken;
          
          const decoded = jwt.verify(
            tokens.accessToken,
            process.env.ACCESS_TOKEN_SECRET
          );
          // console.log("Decoded after refresh:", decoded);
          req.user = decoded.id;
          
          return next();
        } catch (refreshError) {
          // console.log("Error refreshing token:", refreshError);
          return res.status(401).json({
            message: "Failed to refresh authentication",
            success: false,
            error: refreshError.message,
          });
        }
      }
      
      // Access token invalid for other reasons
      return res.status(401).json({
        message: "Invalid or expired token",
        success: false,
        error: error.message,
      });
    }
  } catch (err) {
    // console.log("Unhandled error in middleware:", err);
    return res.status(500).json({
      message: "Server error in authentication",
      success: false,
    });
  }
}