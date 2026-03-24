import { Router } from "express";
import {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quiz.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
router.post("/", auth, requireAdmin, createQuiz);
router.put("/:id", auth, requireAdmin, updateQuiz);
router.delete("/:id", auth, requireAdmin, deleteQuiz);

export default router;
