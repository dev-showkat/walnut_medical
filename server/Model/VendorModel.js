const mongoose = require("mongoose");

const VendorIQCSchema = mongoose.Schema({
  vendor_name: {
    type: String,
    required: false,
  },
 
}, { timestamps: true });

const VendorIqcModel = mongoose.model("vendor_IQC", VendorIQCSchema);

module.exports = VendorIqcModel;
