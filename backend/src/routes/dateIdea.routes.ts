import { Router } from "express";
import {
  getAllDateIdeas,
  getRandomDateIdea,
  getDateIdeaById,
  createDateIdea,
  updateDateIdea,
  deleteDateIdea,
} from "../controllers/dateIdea.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", getAllDateIdeas);
router.get("/random", getRandomDateIdea);
router.get("/:id", getDateIdeaById);
router.post("/", auth, requireAdmin, createDateIdea);
router.put("/:id", auth, requireAdmin, updateDateIdea);
router.delete("/:id", auth, requireAdmin, deleteDateIdea);

export default router;
