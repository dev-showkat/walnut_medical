const mongoose = require("mongoose");
const PostAPIDataSchema = require("./PostAPIDataSchema");

const BharatPeDataSchema = mongoose.Schema(PostAPIDataSchema, {
  timestamps: true,
});

const BharatPeData = mongoose.model("BharatPeData", BharatPeDataSchema);

module.exports = BharatPeData;
