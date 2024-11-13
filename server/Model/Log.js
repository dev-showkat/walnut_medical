const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    method: { type: String },
    endpoint: { type: String },
    statusCode: { type: Number },
    message: { type: String },
    error: { type: String },
    requestBody: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { capped: { size: 1024 * 1024, max: 1000 } }
);

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
