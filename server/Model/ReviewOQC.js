const mongoose = require("mongoose");

const ForReviewSchema = mongoose.Schema(
  {
    batch: {
      type: String,
      required: false,
    },
    line: {
      type: String,
      required: false,
    },
    master_carton: {
      type: String,
      required: false,
    },
    defect_list_name: {
      type: String,
      required: false,
    },
    imei: {
      type: String,
      required: false,
    },
    oqcl: {
      type: String,
      required: false,
    },
    pictures: {
      type: String,
      required: false,
    },
    defect_category: {
      type: String,
      required: false,
    },
    remarks: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const ForReview = mongoose.model("ForReviews", ForReviewSchema);

module.exports = ForReview;
