const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require('path');
 

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

// 🔽 API to get assets with service reports
app.get("/api/service-reports", async (req, res) => {
  try {
    const assetsWithServiceReports = await Asset.find({
      "documents.serviceReports": { $exists: true, $ne: "" }
    });

    res.json(assetsWithServiceReports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch service reports" });
  }
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
