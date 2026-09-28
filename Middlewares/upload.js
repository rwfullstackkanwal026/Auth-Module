const multer = require('multer'); // Multer is an Express middleware used for handling file uploads.
const path = require('path'); // We need it here to get the extension of the uploaded file.
const { BadRequestError } = require('../Errors');

const storage = multer.diskStorage({ //I want to save uploaded files on my server's disk.
  destination: (req, file, cb) => { //where to save the uploaded file.
    // file This contains information about the uploaded file.
    /* cb means callback.

Multer expects you to tell it:

"Did everything go correctly, and where should I save the file?" */
    cb(null, 'uploads/'); // null means no error
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