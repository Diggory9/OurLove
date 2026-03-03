import { Router } from "express";
import { getSiteConfig, updateSiteConfig } from "../controllers/siteConfig.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", getSiteConfig);
router.put("/", auth, requireAdmin, updateSiteConfig);

export default router;
