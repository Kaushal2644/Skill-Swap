import SwapRequest from "../models/SwapRequest.js";
import User from "../models/User.js";

//Send Swap Request
export const sendSwapRequest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: "receiverId is required" });
    }

    // Prevent sending to yourself
    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot send request to yourself" });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate requests
    const existingSwap = await SwapRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
      status: "pending"
    });

    if (existingSwap) {
      return res.status(400).json({
        message: "Swap request already sent"
      });
    }

    const swapRequest = await SwapRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      message,
    });

    res.status(201).json({
      message: "Swap request sent successfully",
      swapRequest,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get received swap request
export const getReceivedSwaps = async (req, res) => {
  try {
    const swaps = await SwapRequest.find({
      receiver: req.user._id,
    }).populate("sender", "name email skillsOffered skillsWanted")
      .sort({createdAt: -1});

      res.status(200).json(swaps);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

//Accept or reject 
export const updateSwapRequest = async(req, res) => {
  try {
    const { status } = req.body;
    const swapId = req.params.id;

    //validate status
    if(!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({message: "Invalid status value"});
    }

    const swap = await SwapRequest.findById(swapId);

    if(!swap) {
      return res.status(404).json({ message: "Swap request not found" });
    }

    // Only receiver can update
    if (swap.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this swap" });
    }

    // Prevent double update
    if (swap.status !== "pending") {
      return res.status(400).json({ message: "Swap already processed" });
    }

    swap.status = status;
    await swap.save();

    res.status(200).json({
      message: `Swap ${status} successfully`,
      swap,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getSentSwaps = async (req, res) => {
  try {
    const swaps = await SwapRequest.find({
      sender: req.user._id
    }).populate("receiver", "name email skillsOffered skillsWanted")
      .sort({createdAt: -1});

    res.status(200).json(swaps)
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}

export const getSwapById = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id)
      .populate("sender", "name email")
      .populate("receiver", "name email");

    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    res.status(200).json(swap);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSwaps = async (req, res) => {
  try {
    const swaps = await SwapRequest.find()
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(swaps);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSwapHistory = async (req, res) => {
  try {
    const swaps = await SwapRequest.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ],
      status: "accepted"
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(swaps);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};