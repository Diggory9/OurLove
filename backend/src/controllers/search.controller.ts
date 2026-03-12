import { Request, Response, NextFunction } from "express";
import { Photo } from "../models/Photo";
import { Album } from "../models/Album";
import { TimelineEvent } from "../models/TimelineEvent";
import { AppError } from "../middleware/errorHandler";

export async function search(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const q = (req.query.q as string || "").trim();
    if (!q || q.length < 2) {
      throw new AppError("Từ khóa tìm kiếm phải có ít nhất 2 ký tự", 400);
    }

    const regex = new RegExp(q, "i");

    const [albums, photos, events] = await Promise.all([
      Album.find({
        $or: [{ title: regex }, { description: regex }],
      })
        .limit(10)
        .lean(),
      Photo.find({
        $or: [{ alt: regex }, { caption: regex }],
      })
        .limit(20)
        .populate("albumId", "title slug")
        .lean(),
      TimelineEvent.find({
        $or: [{ title: regex }, { description: regex }],
      })
        .sort({ date: -1 })
        .limit(10)
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        albums: albums.map((a) => ({ ...a, id: a._id, _id: undefined, __v: undefined })),
        photos: photos.map((p) => ({ ...p, id: p._id, _id: undefined, __v: undefined })),
        events: events.map((e) => ({ ...e, id: e._id, _id: undefined, __v: undefined })),
        total: albums.length + photos.length + events.length,
      },
    });
  } catch (err) {
    next(err);
  }
}
