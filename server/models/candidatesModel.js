const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  firstNameAr: String,
  lastNameAr: String,
  circle: String,
  text1: String,
  text2: String,
  photo: String,
  photoAlign: {
    type: String,
    required: false,
    default: "center"
  }
});
const candidateModel = mongoose.model("candidate", candidateSchema);
module.exports = candidateModel;
