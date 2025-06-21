// middleware/mutler.js
import multer from 'multer';
import path from 'path';

// storage with timestamp + extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  },
});

// optional: file type filter
const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('Only image files are allowed!'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// custom middleware factory
const mutler = (fieldName = 'file') => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'File upload failed',
          error: err.message,
        });
      }
      next();
    });
  };
};

export default mutler;
export { upload, mutler };
 // Export both the upload instance and the middleware