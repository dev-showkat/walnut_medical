const mongoose = require("mongoose");

const BatchDataSchema = mongoose.Schema(
  {
    batch_name: {
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
    total_no: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const BatchData = mongoose.model("BatchData", BatchDataSchema);

module.exports = BatchData;
