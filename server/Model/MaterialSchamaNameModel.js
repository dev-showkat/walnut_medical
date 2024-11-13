const mongoose = require("mongoose");

const MaterialParameterSchema = {
  type: { type: String, default: "text" },
  parameter: { type: String, default: "" },
  spacification: { type: String, default: "" },
  inst_used: { type: String, default: "" },
  actual: { type: String, default: "" },
  status: { type: String, default: "OK" },
  picture: { type: String, default: "" },
  remark: { type: String, default: "" },
};
const MaterialIQCSchemaNameModel = mongoose.Schema(
  {
    material_name: {
      type: String,
      required: false,
    },
    checked_qr_code: {
      type: String,
      required: false,
    },
    MaterialParameter: {
      type: [MaterialParameterSchema],
      default: [
        {
          parameter: "",
          spacification: "",
          inst_used: "",
          actual: "",
          status: "OK",
          picture: "",
          remark: "",
        },
      ],
    },
  },
  { timestamps: true }
);

const materialIqcModelSchema = mongoose.model(
  "materialName_IQC",
  MaterialIQCSchemaNameModel
);

module.exports = materialIqcModelSchema;
