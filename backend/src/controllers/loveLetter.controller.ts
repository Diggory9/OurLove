import { Request, Response, NextFunction } from "express";
import { LoveLetter } from "../models/LoveLetter";
import { AppError } from "../middleware/errorHandler";
import slugify from "../utils/slugify";

export async function getAllLoveLetters(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const now = new Date();
    const filter = {
      isVisible: true,
      $or: [{ scheduledAt: null }, { scheduledAt: { $lte: now } }],
    };

    const [letters, total] = await Promise.all([
      LoveLetter.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      LoveLetter.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: letters,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllLoveLettersAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const [letters, total] = await Promise.all([
      LoveLetter.find().sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      LoveLetter.countDocuments(),
    ]);

    res.json({
      success: true,
      data: letters,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getLoveLetterBySlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const letter = await LoveLetter.findOne({ slug: req.params.slug });
    if (!letter) {
      throw new AppError("Không tìm thấy lời nhắn", 404);
    }

    // Check if scheduled and not yet visible
    if (letter.scheduledAt && letter.scheduledAt > new Date()) {
      throw new AppError("Lời nhắn này chưa đến lúc mở", 403);
    }

    res.json({ success: true, data: letter });
  } catch (err) {
    next(err);
  }
}

export async function createLoveLetter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, content, author, recipient, scheduledAt, isVisible, order } = req.body;
    if (!title || !content) {
      throw new AppError("Tiêu đề và nội dung là bắt buộc", 400);
    }

    const slug = slugify(title);
    const existing = await LoveLetter.findOne({ slug });
    if (existing) {
      throw new AppError("Lời nhắn với tên này đã tồn tại", 400);
    }

    const letter = await LoveLetter.create({
      title,
      slug,
      content,
      author,
      recipient,
      scheduledAt: scheduledAt || null,
      isVisible: isVisible !== false,
      order: order || 0,
    });

    res.status(201).json({ success: true, data: letter });
  } catch (err) {
    next(err);
  }
}

export async function updateLoveLetter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, ...rest } = req.body;
    const updateData: Record<string, unknown> = { ...rest };

    if (title !== undefined) {
      updateData.title = title;
      updateData.slug = slugify(title);
    }

    const letter = await LoveLetter.findOneAndUpdate(
      { slug: req.params.slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!letter) {
      throw new AppError("Không tìm thấy lời nhắn", 404);
    }

    res.json({ success: true, data: letter });
  } catch (err) {
    next(err);
  }
}

export async function deleteLoveLetter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const letter = await LoveLetter.findOneAndDelete({ slug: req.params.slug });
    if (!letter) {
      throw new AppError("Không tìm thấy lời nhắn", 404);
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
