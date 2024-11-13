const mongoose = require("mongoose");

const Websetting = mongoose.Schema(
  {
    token: {
      type: String,
      required: false,
    },
    publicKey: {
      type: String,
      required: false,
    },
    privateKey: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const websetting = mongoose.model("websetting", Websetting);

module.exports = websetting;
