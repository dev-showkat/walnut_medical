const mongoose = require("mongoose");
const PostAPIDataSchema = require("./PostAPIDataSchema");

const PaytmDataSchema = mongoose.Schema(PostAPIDataSchema, {
  timestamps: true,
});

const PaytmData = mongoose.model("PaytmData", PaytmDataSchema);

module.exports = PaytmData;
