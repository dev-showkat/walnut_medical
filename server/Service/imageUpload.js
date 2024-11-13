const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
require("dotenv").config();

const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  accessKeyId: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const fileFilter = (req, file, cb) => {
  // if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
  if (true) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: "tehies-dms-storage",

    key: function (req, file, cb) {
      cb(null, "images/" + Date.now().toString() + file.originalname);
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    },
  }),
});

module.exports = upload;
