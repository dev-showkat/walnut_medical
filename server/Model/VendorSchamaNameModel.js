const mongoose = require("mongoose");

const VendorIQCSchemaNameModel = mongoose.Schema({
  vendor_name: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const VendorIqcModelSchema = mongoose.model("vendorName_IQC", VendorIQCSchemaNameModel);

module.exports = VendorIqcModelSchema;
