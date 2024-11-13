const mongoose = require("mongoose");

const SandBoxOQCLSchema = mongoose.Schema(
  {
    mc_imei_code: {
      type: String,
      required: false,
    },
    oqcl: {
      type: Array,
      required: false,
    },
    bic: {
      type: Array,
      required: false,
    },
    sbcl: {
      type: Array,
      required: false,
    },
    mdbibs: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const SandBoxOQCL = mongoose.model("SandBoxOQCL", SandBoxOQCLSchema);

module.exports = SandBoxOQCL;
