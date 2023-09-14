import multer, { diskStorage } from 'multer';

const storage = diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    if (file.mimetype.startsWith('image')) {
      
      if (req.baseUrl.includes('products')) {
        uploadPath = 'uploads/products';
      } else {
        uploadPath = 'uploads/profile';
      }
    } else {
      uploadPath = 'uploads/documents';
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

export default upload;

