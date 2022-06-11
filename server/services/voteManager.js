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

function sortByName(candidates) {
  return candidates.sort((a,b) => a.firstName.localeCompare(b.firstName))
}

const fetchAllCandidates = async function(req, res) {
  const query = Candidates.find({});
  let candidates = await query;
  candidates = sortByName(candidates);
  return res.json(candidates);
};

const placeVote = async function(req, res) {
  const code = req.body.code;
  const votes = req.body.votes;
  const name = req.body.name;
  const tz = req.body.tz;
  const phone = req.body.phone;
  const email = req.body.email;
  const isCodeValidPromise = Codes.findOne({ "code": code.toUpperCase(), isUsed: { $in: [null, false] } });
  const codeDb = await isCodeValidPromise;
  if (!codeDb || codeDb.isUsed) return res.json(false);
  if (!isIsraeliIdValid(tz)) return res.json(false);
  let updateCodePromise = Codes.updateOne(
    { _id: mongoose.Types.ObjectId(codeDb._id) },
    { isUsed: true }
  );
  let vote = new Votes({ voterCode: code, votes, name, tz, phone, email });
  let updateVotePromise = vote.save();
  return Promise.all([updateCodePromise, updateVotePromise])
      .then(() => res.json(true))
      .catch(e => res.json(false))
};

const isIsraeliIdValid = function(tz) {
  let id = String(tz).trim()
  if (id.length > 9 || isNaN(id) || Number(id) === 0) return false;
  id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
  return Array.from(id, Number).reduce((counter, digit, i) => {
    const step = digit * ((i % 2) + 1);
    return counter + (step > 9 ? step - 9 : step);
  }) % 10 === 0;
}

const validateCode = async function(req, res) {
  const code = req.body.code;
  const getCode = Codes.findOne({"code": code.toUpperCase()});
  const dbCode = await getCode;
  const isCodeValid = dbCode && !dbCode.isUsed;
  await delay(() => {});
  return res.json(!!isCodeValid);
};

const fetchAllVotes = async function(req, res) {
  let votes = await Votes.find({});
  return res.json(votes);
};

module.exports = {
  fetchAllCandidates,
  placeVote,
  validateCode,
  fetchAllVotes
};
