import { Request, Response, NextFunction } from "express";
import { DateIdea } from "../models/DateIdea";
import { AppError } from "../middleware/errorHandler";

export async function getAllDateIdeas(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ideas = await DateIdea.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: ideas });
  } catch (err) {
    next(err);
  }
}

export async function getRandomDateIdea(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const count = await DateIdea.countDocuments();
    if (count === 0) {
      throw new AppError("Chưa có ý tưởng hẹn hò nào", 404);
    }
    const random = Math.floor(Math.random() * count);
    const idea = await DateIdea.findOne().skip(random);
    res.json({ success: true, data: idea });
  } catch (err) {
    next(err);
  }
}

export async function getDateIdeaById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idea = await DateIdea.findById(req.params.id);
    if (!idea) {
      throw new AppError("Không tìm thấy ý tưởng", 404);
    }
    res.json({ success: true, data: idea });
  } catch (err) {
    next(err);
  }
}

export async function createDateIdea(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, description, category, image, estimatedCost, duration, order } = req.body;
    if (!title) {
      throw new AppError("Tiêu đề là bắt buộc", 400);
    }

    const idea = await DateIdea.create({
      title,
      description,
      category: category || "general",
      image,
      estimatedCost,
      duration,
      order: order || 0,
    });

    res.status(201).json({ success: true, data: idea });
  } catch (err) {
    next(err);
  }
}

export async function updateDateIdea(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idea = await DateIdea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!idea) {
      throw new AppError("Không tìm thấy ý tưởng", 404);
    }
    res.json({ success: true, data: idea });
  } catch (err) {
    next(err);
  }
}

export async function deleteDateIdea(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idea = await DateIdea.findByIdAndDelete(req.params.id);
    if (!idea) {
      throw new AppError("Không tìm thấy ý tưởng", 404);
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
