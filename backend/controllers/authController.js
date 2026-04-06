import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Register User
export const registerUser = async ( req, res) => {
    try {
        const { name, email, password, bio, skillsOffered, skillsWanted } = req.body;

        //Check if already exists
        const userExists = await User.findOne({email});
        if(userExists) {
            return res.status(400).json({message: "User already exists"});
        }

        //Hash Pass
        const salt = await bcrypt.genSalt(10);
        const hasPassword = await bcrypt.hash(password, salt);

        //Create User
        const user = await User.create({
            name, 
            email, 
            password: hasPassword,
            bio: bio || "",
            skillsOffered: skillsOffered || [],
            skillsWanted: skillsWanted || [],
        });


        //Generate Token
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "21d"}
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//Login User
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        //Check if user Exists
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid email or password"});
        }

        //Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Invalid email or password"});
        }

        //Generate token
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "21d"}
        );

        res.status(201).json({
            message: "Login Successfull",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}