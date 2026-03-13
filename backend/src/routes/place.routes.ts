import { Router } from "express";
import {
  getAllPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/place.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", getAllPlaces);
router.get("/:id", getPlace);
router.post("/", auth, requireAdmin, createPlace);
router.put("/:id", auth, requireAdmin, updatePlace);
router.delete("/:id", auth, requireAdmin, deletePlace);

export default router;
