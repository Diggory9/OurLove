import { Request, Response, NextFunction } from "express";
import { TimelineEvent } from "../models/TimelineEvent";
import { AppError } from "../middleware/errorHandler";
import slugify from "../utils/slugify";

export async function getAllTimelineEvents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      TimelineEvent.find().sort({ date: -1 }).skip(skip).limit(limit),
      TimelineEvent.countDocuments(),
    ]);

    res.json({
      success: true,
      data: events,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getLatestTimelineEvents(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const events = await TimelineEvent.find().sort({ date: -1 }).limit(5);
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
}

export async function getTimelineEventBySlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const event = await TimelineEvent.findOne({ slug: req.params.slug });
    if (!event) {
      throw new AppError("Không tìm thấy sự kiện", 404);
    }
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

export async function createTimelineEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, date, description, icon, image, images, order } = req.body;
    if (!title || !date) {
      throw new AppError("Tiêu đề và ngày là bắt buộc", 400);
    }

    const slug = slugify(title);
    const existing = await TimelineEvent.findOne({ slug });
    if (existing) {
      throw new AppError("Sự kiện với tên này đã tồn tại", 400);
    }

    const event = await TimelineEvent.create({
      title,
      slug,
      date,
      description,
      icon,
      image,
      images: images || [],
      order: order || 0,
    });

    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

export async function updateTimelineEvent(
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

    const event = await TimelineEvent.findOneAndUpdate(
      { slug: req.params.slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      throw new AppError("Không tìm thấy sự kiện", 404);
    }

    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

export async function deleteTimelineEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const event = await TimelineEvent.findOneAndDelete({
      slug: req.params.slug,
    });
    if (!event) {
      throw new AppError("Không tìm thấy sự kiện", 404);
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
