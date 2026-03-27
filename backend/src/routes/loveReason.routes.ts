import { Router } from "express";
import {
  getAllLoveReasons,
  getRandomLoveReason,
  createLoveReason,
  updateLoveReason,
  deleteLoveReason,
} from "../controllers/loveReason.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", getAllLoveReasons);
router.get("/random", getRandomLoveReason);
router.post("/", auth, requireAdmin, createLoveReason);
router.put("/:id", auth, requireAdmin, updateLoveReason);
router.delete("/:id", auth, requireAdmin, deleteLoveReason);

export default router;
