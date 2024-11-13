const mongoose = require("mongoose");

const UploadFilesSchema = mongoose.Schema(
  {
    res_id: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const UploadFiles = mongoose.model("UploadFiles", UploadFilesSchema);

module.exports = UploadFiles;
