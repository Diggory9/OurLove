import { Router } from "express";
import {
  getAllPhotos,
  getFeaturedPhotos,
  getPhotosByAlbumSlug,
  createPhoto,
  updatePhoto,
  deletePhoto,
} from "../controllers/photo.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", getAllPhotos);
router.get("/featured", getFeaturedPhotos);
router.get("/album/:slug", getPhotosByAlbumSlug);
router.post("/", auth, requireAdmin, createPhoto);
router.put("/:id", auth, requireAdmin, updatePhoto);
router.delete("/:id", auth, requireAdmin, deletePhoto);

export default router;
