const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let error;
    if (MIME_TYPE_MAP[file.mimetype]) {
      error = null;
    } else {
      error = new Error('Invalid mime type!')
    }
    cb(error, './backend/images')
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.${MIME_TYPE_MAP[file.mimetype]}`)
  }
})

module.exports = multer({ storage }).single("image");
