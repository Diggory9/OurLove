import { Router } from "express";
import {
  getAllSpecialDays,
  getUpcomingSpecialDays,
  createSpecialDay,
  updateSpecialDay,
  deleteSpecialDay,
} from "../controllers/specialDay.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", getAllSpecialDays);
router.get("/upcoming", getUpcomingSpecialDays);
router.post("/", auth, requireAdmin, createSpecialDay);
router.put("/:id", auth, requireAdmin, updateSpecialDay);
router.delete("/:id", auth, requireAdmin, deleteSpecialDay);

export default router;
