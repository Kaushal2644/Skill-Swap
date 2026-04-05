import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { protect, adminOnly } from "./middleware/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import swapRoutes from "./routes/swapRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

app.get("/api/profile", protect, (req, res) => {
    res.json(req.user)
});

app.get("/api/admin", protect, adminOnly, (req, res) => {
    res.json({message: "Welcome Admin 👑"});
})

app.get("/", (req, res) => {
    res.send("SkillSwap API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));