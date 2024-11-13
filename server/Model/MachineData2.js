const mongoose = require("mongoose");

const MachineData2Schema = mongoose.Schema(
  {
    DataJson: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const MachineData2 = mongoose.model("MachineData2", MachineData2Schema);

module.exports = MachineData2;
