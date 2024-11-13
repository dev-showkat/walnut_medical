const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    access: {
      type: [Object],
      required: false,
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Roles", RoleSchema);

module.exports = Role;
