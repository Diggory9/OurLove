import { Request, Response, NextFunction } from "express";
import { SpecialDay } from "../models/SpecialDay";
import { AppError } from "../middleware/errorHandler";

function getNextOccurrence(date: Date, recurring: boolean): Date {
  if (!recurring) return date;

  const now = new Date();
  const next = new Date(now.getFullYear(), date.getMonth(), date.getDate());
  if (next < now) {
    next.setFullYear(now.getFullYear() + 1);
  }
  return next;
}

export async function getAllSpecialDays(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const days = await SpecialDay.find().sort({ date: 1 });

    const enriched = days.map((day) => {
      const obj = day.toJSON() as Record<string, unknown>;
      obj.nextOccurrence = getNextOccurrence(day.date, day.recurring);
      return obj;
    });

    // Sort by next occurrence
    enriched.sort(
      (a, b) =>
        new Date(a.nextOccurrence as string).getTime() -
        new Date(b.nextOccurrence as string).getTime()
    );

    res.json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
}

export async function getUpcomingSpecialDays(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const days = await SpecialDay.find();
    const now = new Date();
    const thirtyDaysLater = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    const upcoming = days
      .map((day) => {
        const obj = day.toJSON() as Record<string, unknown>;
        obj.nextOccurrence = getNextOccurrence(day.date, day.recurring);
        return obj;
      })
      .filter((day) => {
        const nextDate = new Date(day.nextOccurrence as string);
        return nextDate >= now && nextDate <= thirtyDaysLater;
      })
      .sort(
        (a, b) =>
          new Date(a.nextOccurrence as string).getTime() -
          new Date(b.nextOccurrence as string).getTime()
      );

    res.json({ success: true, data: upcoming });
  } catch (err) {
    next(err);
  }
}

export async function createSpecialDay(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, date, type, recurring, description, icon, notifyBefore } =
      req.body;
    if (!title || !date) {
      throw new AppError("Tiêu đề và ngày là bắt buộc", 400);
    }

    const day = await SpecialDay.create({
      title,
      date,
      type: type || "custom",
      recurring: recurring !== false,
      description,
      icon,
      notifyBefore: notifyBefore || 7,
    });

    res.status(201).json({ success: true, data: day });
  } catch (err) {
    next(err);
  }
}

export async function updateSpecialDay(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const day = await SpecialDay.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!day) {
      throw new AppError("Không tìm thấy ngày đặc biệt", 404);
    }

    res.json({ success: true, data: day });
  } catch (err) {
    next(err);
  }
}

export async function deleteSpecialDay(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const day = await SpecialDay.findByIdAndDelete(req.params.id);
    if (!day) {
      throw new AppError("Không tìm thấy ngày đặc biệt", 404);
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
