const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const User = require('../models/User');
const path = require('path');
const multer  = require('multer');







/////Single Video Upload
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const videoUpload = multer({ storage: videoStorage });

router.post('/', videoUpload.single('video'), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` });
});










// /////////////////Single Image Upload
// Set storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName = file.originalname
      .replace(fileExt, "")
      .toLowerCase()
      .split(" ")
      .join("-") + "-" + Date.now();
    cb(null, fileName + fileExt);
  }
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

// Set upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: fileFilter
});

////Img Upload
router.post('/image', upload.single('file'), async(req, res)=>{
  try {
    //Deploy Mode
    res.status(200).json({imgURL: req.file.filename});
  
  } catch (error) {
    console.error('Failed to retrieve last seen timestamp:', error.message);
    res.status(500).send('Internal server error');
  }

});


//Export
module.exports = router;