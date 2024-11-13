const mongoose = require("mongoose");

const SampleIdModel = mongoose.Schema(
  {
    Sample_id: {
      type: String,
      required: false,
    },
    material_id: {
      type: String,
      required: false,
    },
    vendor_name: {
      type: String,
      required: false,
    },
    material_name: {
      type: String,
      required: false,
    },
    checked_qr_code: {
      type: String,
      required: false,
    },
    MaterialParameter: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const sampletblSchema = mongoose.model("IQCsampleid's", SampleIdModel);

module.exports = sampletblSchema;
