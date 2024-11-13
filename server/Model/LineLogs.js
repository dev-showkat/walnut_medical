const mongoose = require("mongoose");

const LineLogsSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: false,
    },
    line_name: {
      type: String,
      required: false,
    },
    line_login_time: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    isLogedIn: {
      type: String,
      required: false,
    },
    LogedOutTime: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const LineLogs = mongoose.model("LineLogs", LineLogsSchema);

module.exports = LineLogs;
