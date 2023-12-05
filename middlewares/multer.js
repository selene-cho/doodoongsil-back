const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const HttpError = require('../error/httpError');
const ERRORS = require('../error/errorMessages');

const FILE_SIZE_LIMIT = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function filterMimeTypes(req, file, cb) {
  if (!ALLOWED_MIME_TYPES || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new HttpError(400, ERRORS.DIARY.INVALID_FILE_TYPE), false);
  }

  cb(null, true);
}

exports.uploadFiles = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: 'public-read',
    key: (req, file, cb) => {
      const filePrefix = `${file.fieldname}/${
        req.userId
      }/${Date.now().toString()}`;
      const filename = `${filePrefix}_${file.originalname}`;
      cb(null, filename);
    },
  }),
  fileFilter: filterMimeTypes,
  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },
});
