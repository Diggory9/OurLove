import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

type ValidationRule = {
  field: string;
  required?: boolean;
  type?: "string" | "number" | "boolean" | "date";
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
};

export function validate(rules: ValidationRule[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    for (const rule of rules) {
      const value = req.body[rule.field];

      if (rule.required && (value === undefined || value === null || value === "")) {
        return next(new AppError(`Trường "${rule.field}" là bắt buộc`, 400));
      }

      if (value === undefined || value === null) continue;

      if (rule.type === "string" && typeof value !== "string") {
        return next(new AppError(`Trường "${rule.field}" phải là chuỗi`, 400));
      }

      if (rule.type === "number" && typeof value !== "number") {
        return next(new AppError(`Trường "${rule.field}" phải là số`, 400));
      }

      if (rule.type === "date" && isNaN(new Date(value).getTime())) {
        return next(new AppError(`Trường "${rule.field}" phải là ngày hợp lệ`, 400));
      }

      if (rule.minLength && typeof value === "string" && value.length < rule.minLength) {
        return next(
          new AppError(`Trường "${rule.field}" phải có ít nhất ${rule.minLength} ký tự`, 400)
        );
      }

      if (rule.maxLength && typeof value === "string" && value.length > rule.maxLength) {
        return next(
          new AppError(`Trường "${rule.field}" không được vượt quá ${rule.maxLength} ký tự`, 400)
        );
      }

      if (rule.min !== undefined && typeof value === "number" && value < rule.min) {
        return next(
          new AppError(`Trường "${rule.field}" phải lớn hơn hoặc bằng ${rule.min}`, 400)
        );
      }

      if (rule.max !== undefined && typeof value === "number" && value > rule.max) {
        return next(
          new AppError(`Trường "${rule.field}" phải nhỏ hơn hoặc bằng ${rule.max}`, 400)
        );
      }
    }

    next();
  };
}

// Sanitize string inputs to prevent XSS
export function sanitizeBody(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === "object") {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key]
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/javascript:/gi, "");
      }
    }
  }
  next();
}
