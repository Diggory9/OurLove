import { Router } from "express";
import {
  getAllMusic,
  getAllMusicAdmin,
  createMusic,
  updateMusic,
  deleteMusic,
} from "../controllers/music.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", getAllMusic);
router.get("/admin", auth, requireAdmin, getAllMusicAdmin);
router.post("/", auth, requireAdmin, createMusic);
router.put("/:id", auth, requireAdmin, updateMusic);
router.delete("/:id", auth, requireAdmin, deleteMusic);

export default router;
