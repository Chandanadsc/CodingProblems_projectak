require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../db/db");

router.use(express.json());

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const existingUser = await User.findOne({ email: decodedToken.email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    existingUser.subscriptionStatus = true;
    await existingUser.save();
    res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
