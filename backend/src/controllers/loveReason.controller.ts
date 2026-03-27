import { Request, Response, NextFunction } from "express";
import { LoveReason } from "../models/LoveReason";
import { AppError } from "../middleware/errorHandler";

export async function getAllLoveReasons(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reasons = await LoveReason.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: reasons });
  } catch (err) {
    next(err);
  }
}

export async function getRandomLoveReason(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const count = await LoveReason.countDocuments();
    if (count === 0) {
      throw new AppError("Chưa có lý do yêu nào", 404);
    }
    // Use day-of-year for daily rotation, like DailyQuote
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % count;
    const reason = await LoveReason.findOne().sort({ order: 1, createdAt: -1 }).skip(index);
    res.json({ success: true, data: reason });
  } catch (err) {
    next(err);
  }
}

export async function createLoveReason(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { content, author, order } = req.body;
    if (!content) {
      throw new AppError("Nội dung là bắt buộc", 400);
    }

    const reason = await LoveReason.create({
      content,
      author: author || "",
      order: order || 0,
    });

    res.status(201).json({ success: true, data: reason });
  } catch (err) {
    next(err);
  }
}

export async function updateLoveReason(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reason = await LoveReason.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!reason) {
      throw new AppError("Không tìm thấy lý do", 404);
    }
    res.json({ success: true, data: reason });
  } catch (err) {
    next(err);
  }
}

export async function deleteLoveReason(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reason = await LoveReason.findByIdAndDelete(req.params.id);
    if (!reason) {
      throw new AppError("Không tìm thấy lý do", 404);
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
