const mongoose = require("mongoose");


const MaterialIQCSchema = mongoose.Schema({
  material_name: {
    type: String,
    required: false,
  },
  material_Id: {
    type: String,
    required: false,
  },
  vendor_name: {
    type: String,
    required: false,
  },

 
}, { timestamps: true });

const MaterialIQCModel = mongoose.model("material_IQC", MaterialIQCSchema);

module.exports = MaterialIQCModel;
