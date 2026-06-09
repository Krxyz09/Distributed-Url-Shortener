import { Router } from "express";
import { createShortUrl, listUrls } from "../controllers/urlController.js";

const router = Router();

router.post("/shorten", createShortUrl);
router.get("/urls", listUrls);

export default router;
