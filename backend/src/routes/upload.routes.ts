import { Router } from "express";
import { uploadImage, uploadAudio } from "../middleware/upload";
import { uploadSingle, uploadMultiple, uploadAudioFile } from "../controllers/upload.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.post("/image", auth, requireAdmin, uploadImage.single("image"), uploadSingle);
router.post("/images", auth, requireAdmin, uploadImage.array("images", 10), uploadMultiple);
router.post("/audio", auth, requireAdmin, uploadAudio.single("audio"), uploadAudioFile);

export default router;
