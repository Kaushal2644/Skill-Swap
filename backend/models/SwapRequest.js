import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        message: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    }, {timestamps: true}
);

const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema);

export default SwapRequest;