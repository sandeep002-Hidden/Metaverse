import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { refreshAccessToken } from "../utills/generateToken.js";

interface AuthenticatedRequest extends Request {
  user?: string;
  accessToken?: string;
  refreshToken?: string;
  cookies: { [key: string]: string };
}

export default async function middleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies.NexoraAccessToken;
    const refreshToken = req.cookies.NexoraRefreshToken;

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
        
        const decoded: any = jwt.verify(
          tokens.accessToken,
          process.env.ACCESS_TOKEN_SECRET as string
        );
        req.user = decoded.id;
        
        return next();
      } catch (error: any) {
        return res.status(401).json({
          message: "Error refreshing token",
          success: false,
          error: error.message,
        });
      }
    }
    
    // Access token exists, try to use it
    try {
      const decoded: any = jwt.verify(accessToken as string, process.env.ACCESS_TOKEN_SECRET as string);
      req.user = decoded.id;
      return next();
    } catch (error: any) {
      // Access token expired but refresh token exists
      if (error.name === "TokenExpiredError" && refreshToken) {
        try {
          const tokens = await refreshAccessToken(refreshToken);
          
          if (!tokens.success) {
            return res.status(401).json({
              message: tokens.message,
              success: false,
            });
          }
          
          req.accessToken = tokens.accessToken;
          req.refreshToken = tokens.refreshToken;
          
          const decoded: any = jwt.verify(
            tokens.accessToken,
            process.env.ACCESS_TOKEN_SECRET as string
          );
          req.user = decoded.id;
          
          return next();
        } catch (refreshError: any) {
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
  } catch (err: any) {
    return res.status(500).json({
      message: "Server error in authentication",
      success: false,
    });
  }
}