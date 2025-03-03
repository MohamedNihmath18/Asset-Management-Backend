const Asset = require("../models/Asset");

// 📌 Create Asset
exports.createAsset = async (req, res) => {
  try {
    const {
      equipmentName, assetNo, serialNumber, model, manufacturerName, 
      supplierName, supplierContactNo, department, warrantyPeriod, 
      warrantyStartDate, ppmFrequency, poNo, doNo, invoiceNo1, 
      invoiceNo2, invoiceNo3, totalAmount, lifespan, drInchargeName, 
      purposeOfEquipment, requestedBy 
    } = req.body;

    const documents = {
      testingCommissioning: req.files?.testingCommissioning?.[0]?.path || "",
      serviceReports: req.files?.serviceReports?.[0]?.path || "",
      ppm: req.files?.ppm?.[0]?.path || "",
      license: req.files?.license?.[0]?.path || "",
      contract: req.files?.contract?.[0]?.path || ""
    };

    const newAsset = new Asset({
      equipmentName, assetNo, serialNumber, model, manufacturerName, 
      supplierName, supplierContactNo, department, warrantyPeriod, 
      warrantyStartDate, ppmFrequency, poNo, doNo, invoiceNo1, 
      invoiceNo2, invoiceNo3, totalAmount, lifespan, drInchargeName, 
      purposeOfEquipment, requestedBy, documents
    });

    await newAsset.save();
    res.status(201).json({ success: true, message: "Asset created successfully", asset: newAsset });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating asset", error: error.message });
  }
};

// 📌 Get All Assets
exports.getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find();
    res.status(200).json({ success: true, assets });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching assets", error: error.message });
  }
};

// 📌 Get Single Asset by ID
exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ success: false, message: "Asset not found" });

    res.status(200).json({ success: true, asset });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching asset", error: error.message });
  }
};

// 📌 Update Asset
exports.updateAsset = async (req, res) => {
  try {
    const updatedData = req.body;

    if (req.files) {
      updatedData.documents = {
        testingCommissioning: req.files?.testingCommissioning?.[0]?.path || "",
        serviceReports: req.files?.serviceReports?.[0]?.path || "",
        ppm: req.files?.ppm?.[0]?.path || "",
        license: req.files?.license?.[0]?.path || "",
        contract: req.files?.contract?.[0]?.path || ""
      };
    }

    const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedAsset) return res.status(404).json({ success: false, message: "Asset not found" });

    res.status(200).json({ success: true, message: "Asset updated successfully", asset: updatedAsset });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating asset", error: error.message });
  }
};

// 📌 Delete Asset
exports.deleteAsset = async (req, res) => {
  try {
    const deletedAsset = await Asset.findByIdAndDelete(req.params.id);
    if (!deletedAsset) return res.status(404).json({ success: false, message: "Asset not found" });

    res.status(200).json({ success: true, message: "Asset deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting asset", error: error.message });
  }
};
