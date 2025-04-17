// const multer = require("multer");
// const path = require("path");

// // Storage setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

// module.exports = upload;

// uploadMiddleware.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage setup for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "assets_uploads", // Folder in Cloudinary
    resource_type: "raw", // auto handles pdf, image, etc
    public_id: `${Date.now()}-${file.originalname}`
  }),
});

const upload = multer({ storage });

module.exports = upload;

