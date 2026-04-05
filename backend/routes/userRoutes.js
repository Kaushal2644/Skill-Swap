import express from "express"
import { updateProfile, getAllUsers, getUserById } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);

export default router;