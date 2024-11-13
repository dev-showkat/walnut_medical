const mongoose = require("mongoose");

const PassedMachineSchema = mongoose.Schema(
  {
    imei: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const PassedMachine = mongoose.model("PassedMachine", PassedMachineSchema);

module.exports = PassedMachine;
