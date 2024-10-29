import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import User from "./Schema/User.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors"; // Import cors

const server = express();
let PORT = 4000;

// Enable CORS for all origins
server.use(cors());

// OR you can specify the allowed origins like this (optional):
// server.use(cors({ origin: 'http://localhost:5173' }));

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());

mongoose
  .connect(process.env.DB_LOCATION, {
    autoIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Connection error:", err.message);
  });

const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  isUsernameNotUnique ? (username += nanoid().substring(0, 5)) : "";

  return username;
};

server.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  // Validating the data from frontend
  if (fullname.length < 3) {
    return res
      .status(400)
      .json({ error: "Fullname must be at least 3 letters long" });
  }
  if (!email) {
    return res.status(400).json({ error: "Enter email" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email is invalid" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase, and 1 uppercase letter",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = await generateUsername(email);

    const user = new User({
      personal_info: { fullname, email, password: hashedPassword, username },
    });

    const savedUser = await user.save();
    return res.status(201).json(formatDatatoSend(savedUser));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already exists" });
    }
    console.error(err.message);
    return res
      .status(500)
      .json({ error: "An error occurred, please try again later." });
  }
});

server.post("/signin", async (req, res) => {
  const { email, password } = req.body;
 
  try {
    const user = await User.findOne({ "personal_info.email": email });
    if (!user) {
      return res.status(403).json({ error: "Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.personal_info.password
    );
    if (!isPasswordValid) {
      return res.status(403).json({ error: "Incorrect Password" });
    }

    return res.status(200).json(formatDatatoSend(user));
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ error: "An error occurred, please try again later." });
  }
});


server.listen(PORT, () => {
  console.log("listening on port => " + PORT);
});
