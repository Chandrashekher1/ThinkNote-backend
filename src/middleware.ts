import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

// Extending Request to allow custom userId property
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  // Check if token is provided
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1]; 

  try {
    const decoded = jwt.verify(token, JWT_PASSWORD) as JwtPayload;

    if (!decoded || !decoded.id) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
