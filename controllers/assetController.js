// const Asset = require("../models/Asset");


// // 📌 Create Asset
// exports.createAsset = async (req, res) => {
//   try {
//     const {
//       equipmentName, assetNo, serialNumber, model, manufacturerName, 
//       supplierName, supplierContactNo, department, warrantyPeriod, 
//       warrantyStartDate, ppmFrequency, ppmStartDate, ppmEndDate, poNo, doNo, invoiceNo, 
//       totalAmount, lifespan, drInchargeName, 
//       purposeOfEquipment, requestedBy, equipmentType
//     } = req.body;

//     const documents = {
//       testingCommissioning: req.files?.testingCommissioning?.[0]?.path || "",
//       serviceReports: req.files?.serviceReports?.[0]?.path || "",
//       ppm: req.files?.ppm?.[0]?.path || "",
//       license: req.files?.license?.[0]?.path || "",
//       contract: req.files?.contract?.[0]?.path || ""
//     };

//     const newAsset = new Asset({
//       equipmentName, assetNo, serialNumber, model, manufacturerName, 
//       supplierName, supplierContactNo, department, warrantyPeriod, 
//       warrantyStartDate, ppmFrequency, ppmStartDate, ppmEndDate, poNo, doNo, invoiceNo, 
//       totalAmount, lifespan, drInchargeName, 
//       purposeOfEquipment, requestedBy,  equipmentType, documents
//     });

//     await newAsset.save();
//     res.status(201).json({ success: true, message: "Asset created successfully", asset: newAsset });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error creating asset", error: error.message });
//   }
// };

// // 📌 Get All Assets
// exports.getAllAssets = async (req, res) => {
//   try {
//     const assets = await Asset.find();
//     res.status(200).json({ success: true, assets });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching assets", error: error.message });
//   }
// };

// // 📌 Get Single Asset by ID
// exports.getAssetById = async (req, res) => {
//   try {
//     const asset = await Asset.findById(req.params.id);
//     if (!asset) return res.status(404).json({ success: false, message: "Asset not found" });

//     res.status(200).json({ success: true, asset });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching asset", error: error.message });
//   }
// };

// // 📌 Update Asset
// exports.updateAsset = async (req, res) => {
//   try {
//     const updatedData = req.body;

//     if (req.files) {
//       updatedData.documents = {
//         testingCommissioning: req.files?.testingCommissioning?.[0]?.path || "",
//         serviceReports: req.files?.serviceReports?.[0]?.path || "",
//         ppm: req.files?.ppm?.[0]?.path || "",
//         license: req.files?.license?.[0]?.path || "",
//         contract: req.files?.contract?.[0]?.path || ""
//       };
//     }

//     const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, updatedData, { new: true });

//     if (!updatedAsset) return res.status(404).json({ success: false, message: "Asset not found" });

//     res.status(200).json({ success: true, message: "Asset updated successfully", asset: updatedAsset });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error updating asset", error: error.message });
//   }
// };

// // 📌 Delete Asset
// exports.deleteAsset = async (req, res) => {
//   try {
//     const deletedAsset = await Asset.findByIdAndDelete(req.params.id);
//     if (!deletedAsset) return res.status(404).json({ success: false, message: "Asset not found" });

//     res.status(200).json({ success: true, message: "Asset deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error deleting asset", error: error.message });
//   }
// };

const Asset = require("../models/Asset");
const XLSX = require("xlsx");
const fs = require("fs");

// 📌 Create Asset
exports.createAsset = async (req, res) => {
  try {
    const {
      equipmentName, assetNo, serialNumber, model, manufacturerName,
      supplierName, supplierContactNo, department, warrantyPeriod,
      warrantyStartDate, ppmFrequency, ppmStartDate, ppmEndDate, poNo, doNo, invoiceNo,
      totalAmount, lifespan, drInchargeName,
      purposeOfEquipment, requestedBy, equipmentType
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
      warrantyStartDate, ppmFrequency, ppmStartDate, ppmEndDate, poNo, doNo, invoiceNo,
      totalAmount, lifespan, drInchargeName,
      purposeOfEquipment, requestedBy, equipmentType, documents
    });

    await newAsset.save();
    res.status(201).json({ success: true, message: "Asset created successfully", asset: newAsset });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating asset", error: error.message });
  }
};

// 📌 Import Assets from Excel (New Function)
exports.importAssets = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const assetsToInsert = excelData.map((row) => ({
      equipmentName: row["Equipment Name"] || "",
      assetNo: row["Asset No"] || "",
      serialNumber: row["Serial Number"] || "",
      model: row["Model"] || "",
      manufacturerName: row["Manufacturer Name"] || "",
      supplierName: row["Supplier Name"] || "",
      supplierContactNo: row["Supplier Contact No"] || "",
      department: row["Department"] || "",
      warrantyPeriod: row["Warranty Period"] || "",
      warrantyStartDate: row["Warranty Start Date"] ? new Date(row["Warranty Start Date"]) : null,
      ppmFrequency: row["PPM Frequency"] || "",
      ppmStartDate: row["PPM Start Date"] ? new Date(row["PPM Start Date"]) : null,
      ppmEndDate: row["PPM End Date"] ? new Date(row["PPM End Date"]) : null,
      poNo: row["PO No"] || "",
      doNo: row["DO No"] || "",
      invoiceNo: row["Invoice No"] || "",
      totalAmount: parseFloat(row["Total Amount"]) || 0,
      lifespan: row["Lifespan"] || "",
      drInchargeName: row["Dr Incharge Name"] || "",
      purposeOfEquipment: row["Purpose Of Equipment"] || "",
      requestedBy: row["Requested By"] || "",
      equipmentType: row["Equipment Type"] || "non-critical",
      documents: {},
    }));

    const insertedAssets = await Asset.insertMany(assetsToInsert);

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: `${insertedAssets.length} assets imported successfully`,
      insertedAssets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error importing assets", error: error.message });
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

