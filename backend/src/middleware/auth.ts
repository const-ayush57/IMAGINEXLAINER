import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

// Extend Express Request tightly to inject verified User context globally
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Extract token strictly from HTTP-only Cookie object avoiding LocalStorage
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Missing authentication token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; email: string };
    req.user = decoded; // Inject decoded claims downstream into API handlers
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired session. Please log in again securely." });
  }
};
