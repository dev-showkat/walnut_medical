const mongoose = require("mongoose");

const SystemLogsSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: false,
    },
    system_login_time: {
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

const SystemLogs = mongoose.model("SystemLogs", SystemLogsSchema);

module.exports = SystemLogs;
