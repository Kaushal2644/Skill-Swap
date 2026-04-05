import express from "express";
import {
  sendMessage,
  getConversation,
  getConversations,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getConversations);
router.get("/:userId", protect, getConversation);
router.post("/:userId", protect, sendMessage);

export default router;
