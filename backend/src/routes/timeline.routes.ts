import { Router } from "express";
import {
  getAllTimelineEvents,
  getLatestTimelineEvents,
  getTimelineEventBySlug,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
} from "../controllers/timeline.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", getAllTimelineEvents);
router.get("/latest", getLatestTimelineEvents);
router.get("/:slug", getTimelineEventBySlug);
router.post("/", auth, requireAdmin, createTimelineEvent);
router.put("/:slug", auth, requireAdmin, updateTimelineEvent);
router.delete("/:slug", auth, requireAdmin, deleteTimelineEvent);

export default router;
