import { Router } from "express";
import { summary, timeseries, topUrls } from "../controllers/analyticsController.js";

const router = Router();

router.get("/summary", summary);
router.get("/timeseries", timeseries);
router.get("/top", topUrls);

export default router;
