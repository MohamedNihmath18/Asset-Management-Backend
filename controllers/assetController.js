const Asset = require("../models/Asset");


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

exports.createAsset = async (req, res) => {
  try {
    console.log("📥 Incoming Asset Data:", req.body);
    console.log("📂 Uploaded Files:", req.files);

    const {
      equipmentName, assetNo, serialNumber, model, manufacturerName,
      supplierName, supplierContactNo, department, warrantyPeriod,
      warrantyStartDate, warrantyEndDate, ppmFrequency, ppmStartDate, ppmEndDate, poNo, doNo, invoiceNo,
      totalAmount, lifespan, drInchargeName,
      purposeOfEquipment, requestedBy, equipmentType, status
    } = req.body;

    // const documents = {
    //   testingCommissioning: req.files?.testingCommissioning?.[0]?.path || "",
    //   serviceReports: req.files?.serviceReports?.[0]?.path || "",
    //   ppm: req.files?.ppm?.[0]?.path || "",
    //   license: req.files?.license?.[0]?.path || "",
    //   contract: req.files?.contract?.[0]?.path || ""
    // };

    const documents = {
  testingCommissioning: req.files?.testingCommissioning?.map(f => f.path) || [],
  serviceReports: req.files?.serviceReports?.map(f => f.path) || [],
  ppm: req.files?.ppm?.map(f => f.path) || [],
  license: req.files?.license?.map(f => f.path) || [],
  contract: req.files?.contract?.map(f => f.path) || []
};


    const newAsset = new Asset({
      equipmentName, assetNo, serialNumber, model, manufacturerName,
      supplierName, supplierContactNo, department, warrantyPeriod,
      warrantyStartDate,  warrantyEndDate, ppmFrequency, ppmStartDate, ppmEndDate, poNo, doNo, invoiceNo,
      totalAmount, lifespan, drInchargeName,
      purposeOfEquipment, requestedBy, equipmentType, status, documents
    });

    await newAsset.save();
    res.status(201).json({ success: true, message: "Asset created successfully", asset: newAsset });
  } catch (error) {
    console.error("❌ Error creating asset:", error);
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

// 📌 Update Asset (Append documents)
exports.updateAsset = async (req, res) => {
  try {
    // 1. Get existing asset
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }

    // 2. Prepare updatedData with fields from req.body
    const updatedData = { ...req.body };

    // 3. Handle file uploads (append to existing files)
    const updatedDocuments = {
      testingCommissioning: [
        ...(Array.isArray(asset.documents.testingCommissioning) ? asset.documents.testingCommissioning : asset.documents.testingCommissioning ? [asset.documents.testingCommissioning] : []),
        ...(req.files?.testingCommissioning?.map(file => file.path) || [])
      ],
      serviceReports: [
        ...(Array.isArray(asset.documents.serviceReports) ? asset.documents.serviceReports : asset.documents.serviceReports ? [asset.documents.serviceReports] : []),
        ...(req.files?.serviceReports?.map(file => file.path) || [])
      ],
      ppm: [
        ...(Array.isArray(asset.documents.ppm) ? asset.documents.ppm : asset.documents.ppm ? [asset.documents.ppm] : []),
        ...(req.files?.ppm?.map(file => file.path) || [])
      ],
      license: [
        ...(Array.isArray(asset.documents.license) ? asset.documents.license : asset.documents.license ? [asset.documents.license] : []),
        ...(req.files?.license?.map(file => file.path) || [])
      ],
      contract: [
        ...(Array.isArray(asset.documents.contract) ? asset.documents.contract : asset.documents.contract ? [asset.documents.contract] : []),
        ...(req.files?.contract?.map(file => file.path) || [])
      ]
    };

    updatedData.documents = updatedDocuments;

    // 4. Update the asset
    const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    res.status(200).json({ success: true, message: "Asset updated successfully", asset: updatedAsset });
  } catch (error) {
    console.error("Update error:", error);
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

  // 📌 Bulk Uploads

  exports.bulkUploadAssets = async (req, res) => {
    try {
      const { assets } = req.body;
  
      if (!Array.isArray(assets) || assets.length === 0) {
        return res.status(400).json({ success: false, message: "No assets provided" });
      }
  
      // Optional: Validate each asset here before saving
  
      const inserted = await Asset.insertMany(assets, { ordered: false });
      res.status(201).json({ success: true, message: "Assets uploaded", data: inserted });
    } catch (error) {
      console.error("Bulk upload error:", error);
      res.status(500).json({ success: false, message: "Failed to upload assets", error: error.message });
    }
  };

  // 📂 Delete a document from an asset
exports.deleteAssetDocument = async (req, res) => {
  const { id } = req.params;
  const { field, url } = req.body;

  try {
    const asset = await Asset.findById(id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    const currentFiles = asset.documents?.[field];

    if (!currentFiles || !Array.isArray(currentFiles)) {
      return res.status(400).json({ message: "Invalid document field or not an array" });
    }

    // Remove the file URL from the list
    const updatedFiles = currentFiles.filter((fileUrl) => fileUrl !== url);
    asset.documents[field] = updatedFiles;

    await asset.save();

    res.json({ success: true, message: "Document deleted", documents: asset.documents });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Error deleting document", error: error.message });
  }
};



