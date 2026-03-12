import { Router } from "express";
import {
  getAllBucketItems,
  getBucketItemById,
  createBucketItem,
  updateBucketItem,
  toggleBucketItem,
  deleteBucketItem,
} from "../controllers/bucketList.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", getAllBucketItems);
router.get("/:id", getBucketItemById);
router.post("/", auth, requireAdmin, createBucketItem);
router.put("/:id", auth, requireAdmin, updateBucketItem);
router.patch("/:id/toggle", auth, requireAdmin, toggleBucketItem);
router.delete("/:id", auth, requireAdmin, deleteBucketItem);

export default router;
