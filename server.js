const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require('path');
const Asset = require("../models/Asset");
 

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://msh-asset-system.netlify.app", // ✅ Allow your Netlify frontend
    methods: "GET, POST, PUT, DELETE", // ✅ Allow necessary methods
    credentials: true, // ✅ Allow cookies (if needed)
  })
);

// Basic Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/assets", require("./routes/assetRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/uploads", express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

 
// Route to get all service reports
router.get("/service-reports", async (req, res) => {
  try {
    const assetsWithServiceReports = await Asset.find({
      "documents.serviceReports": { $ne: null },
    });

    res.json(assetsWithServiceReports);
  } catch (error) {
    console.error("Error fetching service reports:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
