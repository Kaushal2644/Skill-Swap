import express from "express";
import {
  sendSwapRequest,
  getReceivedSwaps,
  updateSwapRequest,
  getSentSwaps,
  getSwapById,
  getSwapHistory
} from "../controllers/swapController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendSwapRequest);
router.get("/sent", protect, getSentSwaps);
router.get("/history", protect, getSwapHistory);
router.get("/", protect, getReceivedSwaps);
router.get("/:id", protect, getSwapById);
router.put("/:id", protect, updateSwapRequest);

export default router;