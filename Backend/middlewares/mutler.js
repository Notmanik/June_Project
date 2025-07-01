// middleware/mutler.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// file type filter
const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('Only image files are allowed!'));
  }
  cb(null, true);
};

// middleware factory function
const mutler = (fieldName = 'file', folder = 'uploads/') => {
  // Ensure folder exists
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, folder),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + '-' + file.fieldname + ext);
    },
  });

  const upload = multer({ storage, fileFilter });

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
export { mutler };
