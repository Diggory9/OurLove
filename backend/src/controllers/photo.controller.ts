import { Request, Response, NextFunction } from "express";
import { Photo } from "../models/Photo";
import { Album } from "../models/Album";
import { AppError } from "../middleware/errorHandler";

export async function getAllPhotos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { albumId } = req.query;
    const filter: Record<string, unknown> = {};
    if (albumId) filter.albumId = albumId;

    const photos = await Photo.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .populate("albumId", "title slug");
    res.json({ success: true, data: photos });
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedPhotos(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const photos = await Photo.find({ featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(6)
      .populate("albumId", "title slug");
    res.json({ success: true, data: photos });
  } catch (err) {
    next(err);
  }
}

export async function getPhotosByAlbumSlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const album = await Album.findOne({ slug: req.params.slug });
    if (!album) {
      throw new AppError("Không tìm thấy album", 404);
    }

    const photos = await Photo.find({ albumId: album._id }).sort({
      order: 1,
      createdAt: -1,
    });
    res.json({ success: true, data: photos });
  } catch (err) {
    next(err);
  }
}

export async function createPhoto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { albumId, src, thumbnail, alt, caption, dateTaken, order, featured, width, height } =
      req.body;

    if (!albumId || !src) {
      throw new AppError("Album và ảnh là bắt buộc", 400);
    }

    const album = await Album.findById(albumId);
    if (!album) {
      throw new AppError("Không tìm thấy album", 404);
    }

    const photo = await Photo.create({
      albumId,
      src,
      thumbnail: thumbnail || src,
      alt,
      caption,
      dateTaken,
      order: order || 0,
      featured: featured || false,
      width: width || 0,
      height: height || 0,
    });

    // Update photo count
    await Album.findByIdAndUpdate(albumId, { $inc: { photoCount: 1 } });

    res.status(201).json({ success: true, data: photo });
  } catch (err) {
    next(err);
  }
}

export async function updatePhoto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!photo) {
      throw new AppError("Không tìm thấy ảnh", 404);
    }

    res.json({ success: true, data: photo });
  } catch (err) {
    next(err);
  }
}

export async function deletePhoto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);
    if (!photo) {
      throw new AppError("Không tìm thấy ảnh", 404);
    }

    // Update photo count
    await Album.findByIdAndUpdate(photo.albumId, { $inc: { photoCount: -1 } });

    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
