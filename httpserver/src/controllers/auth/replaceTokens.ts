import { Request, Response } from 'express';

interface TokenRequest extends Request {
  accessToken?: string;
  refreshToken?: string;
}

export default function replaceTokens(req: TokenRequest, res: Response){
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
      return res
}