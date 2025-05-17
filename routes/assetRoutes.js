const express = require("express");
const { 
  createAsset, 
  getAllAssets, 
  getAssetById, 
  updateAsset, 
  deleteAsset,
  bulkUploadAssets, // ✅ new controller
  
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

// ✅ Bulk Upload route
router.post("/bulk-upload", bulkUploadAssets);


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

// ✅ NEW: Delete document route
router.put("/delete-document/:id", assetController.deleteAssetDocument);


module.exports = router;
