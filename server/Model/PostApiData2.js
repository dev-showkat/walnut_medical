const mongoose = require("mongoose");

const PostApiData2Schema = mongoose.Schema({
  publicKey: {
    type: String,
    required: false,
  },
  imei: {
    type: String,
    required: false,
  },
  prdappver: {
    type: String,
    required: false,
  },
  sim: {
    type: String,
    required: false,
  },
  pdp_status: {
    type: String,
    required: false,
  },
  ver_app: {
    type: String,
    required: false,
  },
  ver_res: {
    type: String,
    required: false,
  },
  ver_dfota: {
    type: String,
    required: false,
  },
  memid: {
    type: String,
    required: false,
  },
  memfree: {
    type: String,
    required: false,
  },
  memused: {
    type: String,
    required: false,
  },
  memtotal: {
    type: String,
    required: false,
  },
  readtime: {
    type: String,
    required: false,
  },
  writetime: {
    type: String,
    required: false,
  },
  audio_voltage: {
    type: String,
    required: false,
  },
  audio_current: {
    type: String,
    required: false,
  },
  key1: {
    type: String,
    required: false,
  },
  key2: {
    type: String,
    required: false,
  },
  key3: {
    type: String,
    required: false,
  },
  key4: {
    type: String,
    required: false,
  },
  key5: {
    type: String,
    required: false,
  },
  full_char_voltage: {
    type: String,
    required: false,
  },
  full_char_current: {
    type: String,
    required: false,
  },
  low_batt_voltage: {
    type: String,
    required: false,
  },
  low_batt_current: {
    type: String,
    required: false,
  },
  standby_current: {
    type: String,
    required: false,
  },
  ledred: {
    type: String,
    required: false,
  },
  ledgreen: {
    type: String,
    required: false,
  },
  ledblue: {
    type: String,
    required: false,
  },
  appdl: {
    type: String,
    required: false,
  },
  resourcedl: {
    type: String,
    required: false,
  },
  fotadl: {
    type: String,
    required: false,
  },
  unzip_app: {
    type: String,
    required: false,
  },
  unzip_res: {
    type: String,
    required: false,
  },
  unzip_dfota: {
    type: String,
    required: false,
  },
  sha_app: {
    type: String,
    required: false,
  },
  sha_res: {
    type: String,
    required: false,
  },
  sha_dfota: {
    type: String,
    required: false,
  },
  file_list: {
    type: String,
    required: false,
  },
  apn: {
    type: String,
    required: false,
  },
  token: {
    type: String,
    required: false,
  },
  custom_1: {
    type: String,
    required: false,
  },
  custom_2: {
    type: String,
    required: false,
  },
  file_cleanup: {
    type: String,
    required: false,
  },
  app_install: {
    type: String,
    required: false,
  },
  fota_command: {
    type: String,
    required: false,
  },
  test_result: {
    type: String,
    required: false,
  },
  fail_reason: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
});

const PostApiData2 = mongoose.model("post-api-data2", PostApiData2Schema);

module.exports = PostApiData2;
