import { Router } from "express";
import {
  getAllLoveLetters,
  getAllLoveLettersAdmin,
  getLoveLetterBySlug,
  createLoveLetter,
  updateLoveLetter,
  deleteLoveLetter,
} from "../controllers/loveLetter.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", getAllLoveLetters);
router.get("/admin", auth, requireAdmin, getAllLoveLettersAdmin);
router.get("/:slug", getLoveLetterBySlug);
router.post("/", auth, requireAdmin, createLoveLetter);
router.put("/:slug", auth, requireAdmin, updateLoveLetter);
router.delete("/:slug", auth, requireAdmin, deleteLoveLetter);

export default router;
