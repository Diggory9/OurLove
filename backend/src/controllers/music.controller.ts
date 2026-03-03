import { Request, Response, NextFunction } from "express";
import { Music } from "../models/Music";
import { AppError } from "../middleware/errorHandler";

export async function getAllMusic(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const music = await Music.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, data: music });
  } catch (err) {
    next(err);
  }
}

export async function getAllMusicAdmin(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const music = await Music.find().sort({ order: 1 });
    res.json({ success: true, data: music });
  } catch (err) {
    next(err);
  }
}

export async function createMusic(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, artist, url, order, active } = req.body;
    if (!title || !url) {
      throw new AppError("Tên bài hát và URL là bắt buộc", 400);
    }

    const music = await Music.create({
      title,
      artist,
      url,
      order: order || 0,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({ success: true, data: music });
  } catch (err) {
    next(err);
  }
}

export async function updateMusic(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const music = await Music.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!music) {
      throw new AppError("Không tìm thấy bài hát", 404);
    }

    res.json({ success: true, data: music });
  } catch (err) {
    next(err);
  }
}

export async function deleteMusic(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const music = await Music.findByIdAndDelete(req.params.id);
    if (!music) {
      throw new AppError("Không tìm thấy bài hát", 404);
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
