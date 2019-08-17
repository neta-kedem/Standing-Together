const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voterCode: String,
  votes: [String],
  timeStamp: { type: String, default: Date }
});
const voteModel = mongoose.model("vote", voteSchema);
module.exports = voteModel;
