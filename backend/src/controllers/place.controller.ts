import { Request, Response, NextFunction } from "express";
import { Place } from "../models/Place";
import { AppError } from "../middleware/errorHandler";

export async function getAllPlaces(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const places = await Place.find().sort({ order: 1, date: -1 });
    res.json({ success: true, data: places });
  } catch (err) {
    next(err);
  }
}

export async function getPlace(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      throw new AppError("Không tìm thấy địa điểm", 404);
    }
    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
}

export async function createPlace(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, description, lat, lng, image, date, order } = req.body;
    if (!title || lat == null || lng == null) {
      throw new AppError("Tiêu đề, vĩ độ và kinh độ là bắt buộc", 400);
    }

    const place = await Place.create({
      title,
      description,
      lat,
      lng,
      image,
      date,
      order: order || 0,
    });

    res.status(201).json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
}

export async function updatePlace(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!place) {
      throw new AppError("Không tìm thấy địa điểm", 404);
    }

    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
}

export async function deletePlace(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      throw new AppError("Không tìm thấy địa điểm", 404);
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
