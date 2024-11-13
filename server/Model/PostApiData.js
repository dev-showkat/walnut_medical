const mongoose = require("mongoose");
const PostAPIDataSchema = require("./PostAPIDataSchema");

const PostApiDataSchema = mongoose.Schema(PostAPIDataSchema, {
  timestamps: true,
});

const PostApiData = mongoose.model("post-api-data", PostApiDataSchema);

module.exports = PostApiData;
