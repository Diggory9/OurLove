import { Router } from "express";
import {
  getAllAlbums,
  getAlbumBySlug,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from "../controllers/album.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:slug", getAlbumBySlug);
router.post("/", auth, requireAdmin, createAlbum);
router.put("/:slug", auth, requireAdmin, updateAlbum);
router.delete("/:slug", auth, requireAdmin, deleteAlbum);

export default router;
