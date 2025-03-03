const express = require("express");
const { 
  createAsset, 
  getAllAssets, 
  getAssetById, 
  updateAsset, 
  deleteAsset 
} = require("../controllers/assetController");

const upload = require("../middleware/uploadMiddleware"); // Multer file upload middleware
const router = express.Router();

// Create Asset (with file upload)
router.post("/create", upload.fields([
  { name: "testingCommissioning" }, 
  { name: "serviceReports" }, 
  { name: "ppm" }, 
  { name: "license" }, 
  { name: "contract" }
]), createAsset);

// Get All Assets
router.get("/", getAllAssets);

// Get Single Asset by ID
router.get("/:id", getAssetById);

// Update Asset
router.put("/:id", upload.fields([
  { name: "testingCommissioning" }, 
  { name: "serviceReports" }, 
  { name: "ppm" }, 
  { name: "license" }, 
  { name: "contract" }
]), updateAsset);

// Delete Asset
router.delete("/:id", deleteAsset);

module.exports = router;
