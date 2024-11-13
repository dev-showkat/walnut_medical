const mongoose = require("mongoose");
const PostAPIDataSchema = require("./PostAPIDataSchema");

const HDFCDataSchema = mongoose.Schema(PostAPIDataSchema, {
  timestamps: true,
});

const HDFCData = mongoose.model("HDFCData", HDFCDataSchema);

module.exports = HDFCData;
