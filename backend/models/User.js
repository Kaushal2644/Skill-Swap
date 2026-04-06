import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String, 
        default: "",
    },
    skillsOffered: [{
            type: String,
        },
    ],
    skillsWanted: [{
            type: String,
        },
    ],
    rating: {
        type: Number,
        default: 0,
        max: 5,
    },
    role: {
        type: String,
        default: "user",
    },
}, {timestamps: true});

const User = mongoose.model("User", userSchema)
export default User;