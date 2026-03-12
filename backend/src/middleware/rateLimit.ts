import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const key of Object.keys(store)) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(windowMs: number, maxRequests: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = { count: 1, resetTime: now + windowMs };
      return next();
    }

    store[key].count++;

    if (store[key].count > maxRequests) {
      res.status(429).json({
        success: false,
        message: "Quá nhiều yêu cầu. Vui lòng thử lại sau.",
      });
      return;
    }

    next();
  };
}

// Pre-configured rate limiters
export const authLimiter = rateLimit(15 * 60 * 1000, 10); // 10 attempts per 15 min
export const apiLimiter = rateLimit(60 * 1000, 100); // 100 requests per minute
export const uploadLimiter = rateLimit(60 * 1000, 20); // 20 uploads per minute
