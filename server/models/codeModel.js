const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  code: String,
  isUsed: {
    type: Boolean,
    default: false
  }
});
const codeModel = mongoose.model("code", codeSchema);
module.exports = codeModel;
