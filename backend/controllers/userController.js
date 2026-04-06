import User from "../models/User.js";

//Update profile
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.skillsOffered = req.body.skillsOffered || user.skillsOffered;
        user.skillsWanted = req.body.skillsWanted || user.skillsWanted;

        const updateUser = await user.save();

        res.json({
            message: "Profile updated successfully",
            user: updateUser,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//Get all user
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({_id: {$ne: req.user._id}}).select("-password");

        res.json(users);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

//Get single user by id
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.json(user);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}