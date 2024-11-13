const mongoose = require("mongoose");

const SandBoxOQCLSingleSchema = mongoose.Schema(
  {
    mc_imei_code: {
      type: String,
      required: false,
    },
    ref_id: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const SandBoxOQCLSingle = mongoose.model(
  "SandBoxOQCLSingle",
  SandBoxOQCLSingleSchema
);

module.exports = SandBoxOQCLSingle;
