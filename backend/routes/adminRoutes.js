import express from "express";
import { getAllSwaps } from "../controllers/swapController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/swaps", protect, adminOnly, getAllSwaps);

export default router;