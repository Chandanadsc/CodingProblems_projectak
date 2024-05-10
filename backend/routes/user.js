require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../db/db");

router.use(express.json());

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (username && email && password) {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      const token = jwt.sign({ username, email }, process.env.JWT_SECRET);

      res
        .status(201)
        .json({ message: "User created successfully", token, user });
    } else {
      res.status(400).json({ message: "Username or email already exists" });
    }
  } else {
    res.json({ message: "Required username email and password for signup" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      try {
        const result = await bcrypt.compare(password, existingUser.password);
        if (result) {
          const token = jwt.sign(
            {
              username: existingUser.username,
              email: existingUser.email,
            },
            process.env.JWT_SECRET
          );
          res.json({
            message: "Logged in SUCCESSFULLY",
            token,
          });
        } else {
          res.status(401).json({ message: "Invalid password" });
        }
      } catch (error) {
        console.error("Error comparing passwords:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else {
    res
      .status(400)
      .json({ message: "Required username, email, and password for login" });
  }
});

module.exports = router;
