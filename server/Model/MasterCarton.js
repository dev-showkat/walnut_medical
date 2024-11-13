const mongoose = require("mongoose");

const MasterCartonSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: false,
    },
    batch_name: {
      type: String,
      required: false,
    },
    mono_carton: {
      type: String,
      required: false,
    },
    sandee: {
      type: String,
      required: false,
    },
    masterCartonNumber: {
      type: String,
      required: false,
    },
    details: {
      type: Array,
      required: false,
    },
    ModalNumber: {
      type: String,
      required: false,
    },
    LineNumber: {
      type: String,
      required: false,
    },
    MasterCartonDate: {
      type: String,
      required: false,
    },
    BoxNumber: {
      type: String,
      required: false,
    },
    Language: {
      type: String,
      required: false,
    },
    check_status: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const MasterCarton = mongoose.model("MasterCarton", MasterCartonSchema);

module.exports = MasterCarton;
