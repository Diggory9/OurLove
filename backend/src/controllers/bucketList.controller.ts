import { Request, Response, NextFunction } from "express";
import { BucketList } from "../models/BucketList";
import { AppError } from "../middleware/errorHandler";

export async function getAllBucketItems(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const skip = (page - 1) * limit;
    const { category, completed } = req.query;

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (completed !== undefined) filter.completed = completed === "true";

    const [items, total] = await Promise.all([
      BucketList.find(filter).sort({ completed: 1, order: 1, createdAt: -1 }).skip(skip).limit(limit),
      BucketList.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getBucketItemById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await BucketList.findById(req.params.id);
    if (!item) {
      throw new AppError("Không tìm thấy mục", 404);
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function createBucketItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, description, category, order } = req.body;
    if (!title) {
      throw new AppError("Tiêu đề là bắt buộc", 400);
    }

    const item = await BucketList.create({
      title,
      description,
      category,
      order: order || 0,
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function updateBucketItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await BucketList.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      throw new AppError("Không tìm thấy mục", 404);
    }

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function toggleBucketItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await BucketList.findById(req.params.id);
    if (!item) {
      throw new AppError("Không tìm thấy mục", 404);
    }

    item.completed = !item.completed;
    item.completedDate = item.completed ? new Date() : null;
    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteBucketItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await BucketList.findByIdAndDelete(req.params.id);
    if (!item) {
      throw new AppError("Không tìm thấy mục", 404);
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
