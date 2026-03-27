import { Router } from "express";
import { getOnThisDay } from "../controllers/onThisDay.controller";

const router = Router();

router.get("/", getOnThisDay);

export default router;
