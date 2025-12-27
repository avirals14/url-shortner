import express from "express";
import { createShortUrl, getAnalytics, getOriginalUrl } from "../controllers/url.controller.js";

const router = express.Router();

// API
router.post("/shorten", createShortUrl);
router.get("/analytics/:shortCode", getAnalytics);

// Redirect
router.get("/:shortCode", getOriginalUrl);

export default router;