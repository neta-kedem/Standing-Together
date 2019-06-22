const mongoose = require("mongoose");
const Event = require("../models/eventModel");
const Candidates = require("../models/candidatesModel");
const Codes = require("../models/codeModel");
const Votes = require("../models/voteModel");
const Authentication = require("../services/authentication");
const MongooseUpdater = require("../services/dbHelper/mongooseUpdater");
const arrayFunctions = require("../services/arrayFunctions");

function delay(val, timeout = 1000) {
  return new Promise(resolve => {
    setTimeout(() => resolve(val), timeout);
  });
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const fetchAllCandidates = async function(req, res) {
  const query = Candidates.find({});
  let candidates = await query;
  candidates = shuffle(candidates);
  return res.json(candidates);
};

const placeVote = async function(req, res) {
  const code = req.body.code;
  const votes = req.body.votes;
  const query = Codes.findOne({ code, isUsed: { $in: [null, false] } });
  const isCodeValidPromise = query;
  const codeDb = await isCodeValidPromise;
  if (!codeDb || codeDb.isUsed) return res.json(false);

  let updateCodePromise = Codes.updateOne(
    { _id: mongoose.Types.ObjectId(codeDb._id) },
    { isUsed: true }
  )
  let vote = new Votes({ voterCode: code, votes: votes })
  let updateVotePromise = vote.save()

  return Promise.all([updateCodePromise, updateVotePromise])
      .then(() => res.json(true))
      .catch(e =>res.json(false))
};

const validateCode = async function(req, res) {
  const code = req.body.code;
  const query = Codes.findOne({ code });
  const getCode = query;
  const dbCode = await getCode;
  const isCodeValid = dbCode && !dbCode.isUsed;
  await delay(() => {});
  return res.json(isCodeValid);
};

module.exports = {
  fetchAllCandidates,
  placeVote,
  validateCode
};
