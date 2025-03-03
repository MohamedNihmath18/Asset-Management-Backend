const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
 

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/assets", require("./routes/assetRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/uploads", express.static("uploads"));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
