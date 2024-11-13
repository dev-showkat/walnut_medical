const mongoose = require("mongoose");

const MachineDataSchema = mongoose.Schema(
  {
    DataJson: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const MachineData = mongoose.model("MachineData", MachineDataSchema);

module.exports = MachineData;
