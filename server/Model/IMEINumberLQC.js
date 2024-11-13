const mongoose = require("mongoose");

const IMEINumberLQC = mongoose.Schema(
  {
    IMEI: {
      type: String,
      required: false,
    },
    line_name: {
      type: String,
      required: false,
    },
    user_id: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    batch_number: {
      type: String,
      required: false,
    },
    IMEI_status: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const iMEInumberlQC = mongoose.model("IMEI_NumberLQC", IMEINumberLQC);

module.exports = iMEInumberlQC;
