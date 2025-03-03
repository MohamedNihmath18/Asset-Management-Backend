const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  equipmentName: { type: String, required: true },
  assetNo: { type: String, required: true, unique: true, lowercase: true }, // Case-insensitive unique
  serialNumber: { type: String, required: true },
  model: { type: String, required: true },
  manufacturerName: { type: String, required: true },
  supplierName: { type: String, required: true },
  supplierContactNo: { type: String, required: true }, // Keep as String if it has special characters
  department: { type: String, required: true },
  warrantyPeriod: { type: String, required: true },
  warrantyStartDate: { type: Date, required: true },
  ppmFrequency: { type: String, required: true },
  poNo: { type: String, required: true },
  doNo: { type: String, required: true },
  invoiceNo1: { type: String, required: true },
  invoiceNo2: { type: String },
  invoiceNo3: { type: String },
  totalAmount: { type: Number, required: true },
  lifespan: { type: String, required: true }, // Changed to Number for calculations
  drInchargeName: { type: String, required: true },
  purposeOfEquipment: { type: String, required: true },
  requestedBy: { type: String, required: true },

  // File Uploads (Storing file paths)
  documents: {
    testingCommissioning: { type: String }, 
    serviceReports: { type: String }, 
    ppm: { type: String }, 
    license: { type: String }, 
    contract: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model("Asset", assetSchema);
