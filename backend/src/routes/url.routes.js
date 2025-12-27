import express from "express";
import { createShortUrl, getOriginalUrl } from "../controllers/url.controller.js";

const router = express.Router();

router.post("/shorten", createShortUrl);
router.get("/:shortCode", getOriginalUrl);

export default router;