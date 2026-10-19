const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const ApiError = require('@utils/ApiError');

function createStorage(folderName) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(process.cwd(), 'uploads', folderName));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const randomName = crypto.randomBytes(16).toString('hex');
      cb(null, `${randomName}${ext}`);
    }
  });
}

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const ticketMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

// Avatar upload (single, max 2MB)
const uploadAvatar = multer({
  storage: createStorage('profiles'),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (!imageMimeTypes.includes(file.mimetype)) {
      return cb(ApiError.badRequest('Only JPEG, PNG, and WebP images are allowed for avatar'));
    }
    cb(null, true);
  }
}).single('avatar');

// Product images upload (multiple, max 8 files, max 5MB each)
const uploadProductImages = multer({
  storage: createStorage('products'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter: (req, file, cb) => {
    if (!imageMimeTypes.includes(file.mimetype)) {
      return cb(ApiError.badRequest('Only JPEG, PNG, and WebP images are allowed for product images'));
    }
    cb(null, true);
  }
}).array('images', 8);

// Ticket attachments upload (multiple, max 3 files, max 5MB each, images or PDF)
const uploadTicketAttachments = multer({
  storage: createStorage('tickets'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter: (req, file, cb) => {
    if (!ticketMimeTypes.includes(file.mimetype)) {
      return cb(ApiError.badRequest('Only JPEG, PNG, WebP, and PDF files are allowed for attachments'));
    }
    cb(null, true);
  }
}).array('attachments', 3);

module.exports = {
  uploadAvatar,
  uploadProductImages,
  uploadTicketAttachments
};
