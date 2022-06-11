const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voterCode: String,
  votes: [String],
  name: String,
  tz: String,
  phone: String,
  email: String,
  timeStamp: { type: String, default: Date }
});
const voteModel = mongoose.model("vote", voteSchema);
module.exports = voteModel;
