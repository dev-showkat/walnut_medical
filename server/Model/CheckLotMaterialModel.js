const mongoose = require("mongoose");

const CheckLotMaterialModel = mongoose.Schema(
  {
    material_name: {
      type: String,
      required: false,
    },
    lot_id: {
      type: String,
      required: false,
    },
    material_id: {
      type: String,
      required: false,
    },
    tolerence: {
      type: String,
      required: false,
    },
    inspected_date: {
      type: String,
      required: false,
    },
    lot_size: {
      type: String,
      required: false,
    },
    sample_size: {
      type: String,
      required: false,
    },
    rejection_percentage: {
      type: String,
      required: false,
    },
    vendor_name: {
      type: String,
      required: false,
    },
    component_value: {
      type: String,
      required: false,
    },
    invoice_number: {
      type: String,
      required: false,
    },
    dwg_no: {
      type: String,
      required: false,
    },
    part_no: {
      type: String,
      required: false,
    },
    item_accepted_qty: {
      type: String,
      required: false,
    },
    rejected_qty: {
      type: String,
      required: false,
    },
    qc_inspector: {
      type: String,
      required: false,
    },

    approved_by: {
      type: String,
      required: false,
    },

    remarks: {
      type: String,
      required: false,
    },
    rejected_status: {
      type: String,
      required: false,
    },
    rejected_lot_remark: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const checkLotMaterail = mongoose.model(
  "CheckLot_material",
  CheckLotMaterialModel
);

module.exports = checkLotMaterail;
