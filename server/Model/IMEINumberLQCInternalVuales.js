const mongoose = require("mongoose");

const IMEINumberLQCInternalVuales = mongoose.Schema(
  {
    ref_IMEI: {
      type: String,
      required: false,
    },
    user_id: {
      type: String,
      required: false,
    },
    line_name: {
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
    Soundboxlinequalitychecklist: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const iMEInumberlQCinternalvuales = mongoose.model(
  "IMEINumber_LQC_InternalVuales",
  IMEINumberLQCInternalVuales
);

module.exports = iMEInumberlQCinternalvuales;
