import { Request, Response, NextFunction } from "express";
import { Album } from "../models/Album";
import { Photo } from "../models/Photo";
import { AppError } from "../middleware/errorHandler";
import slugify from "../utils/slugify";

export async function getAllAlbums(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const albums = await Album.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: albums });
  } catch (err) {
    next(err);
  }
}

export async function getAlbumBySlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const album = await Album.findOne({ slug: req.params.slug });
    if (!album) {
      throw new AppError("Không tìm thấy album", 404);
    }
    res.json({ success: true, data: album });
  } catch (err) {
    next(err);
  }
}

export async function createAlbum(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, description, coverImage, order } = req.body;
    if (!title) {
      throw new AppError("Tiêu đề album là bắt buộc", 400);
    }

    const slug = slugify(title);
    const existing = await Album.findOne({ slug });
    if (existing) {
      throw new AppError("Album với tên này đã tồn tại", 400);
    }

    const album = await Album.create({
      title,
      slug,
      description,
      coverImage,
      order: order || 0,
    });

    res.status(201).json({ success: true, data: album });
  } catch (err) {
    next(err);
  }
}

export async function updateAlbum(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, description, coverImage, order } = req.body;
    const updateData: Record<string, unknown> = {};

    if (title !== undefined) {
      updateData.title = title;
      updateData.slug = slugify(title);
    }
    if (description !== undefined) updateData.description = description;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (order !== undefined) updateData.order = order;

    const album = await Album.findOneAndUpdate(
      { slug: req.params.slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!album) {
      throw new AppError("Không tìm thấy album", 404);
    }

    res.json({ success: true, data: album });
  } catch (err) {
    next(err);
  }
}

export async function deleteAlbum(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const album = await Album.findOneAndDelete({ slug: req.params.slug });
    if (!album) {
      throw new AppError("Không tìm thấy album", 404);
    }

    // Delete all photos in the album
    await Photo.deleteMany({ albumId: album._id });

    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
