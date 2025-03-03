const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createAsset, getAllAssets, getAssetById, updateAsset, deleteAsset } = require("../controllers/assetController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const SECRET_KEY = "MHahsahospitalchvbbnb"; // Change this in production

// Register Admin User
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, role: "admin" });
  
      await newUser.save();
      res.status(201).json({ success: true, message: "Admin user created successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error creating admin user" });
    }
  });

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "2h" });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
});

// Protect all asset routes with authentication middleware
router.post("/create", authMiddleware, createAsset);
router.get("/", authMiddleware, getAllAssets);
router.get("/:id", authMiddleware, getAssetById);
router.put("/:id", authMiddleware, updateAsset);
router.delete("/:id", authMiddleware, deleteAsset);


module.exports = router;
