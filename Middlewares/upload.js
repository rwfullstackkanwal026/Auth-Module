const multer = require('multer'); // for image uploads
const path = require('path');
const { BadRequestError } = require('../Errors');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // req.user exists here because authenticate() runs BEFORE this middleware in the route
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${req.user.userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new BadRequestError('Only jpeg, png, and webp images are allowed'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

module.exports = upload;