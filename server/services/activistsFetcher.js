const Activist = require('../models/activistModel');
const mongoose = require('mongoose');
const objectIdMapper = require("./dbHelper/objectIdMapper");
const objectDateMapper = require("./dbHelper/objectDateMapper");

const getActivistsByIds = function (ids){
    const query = Activist.aggregate([
        {
            $lookup: {
                from: 'events',
                localField: "profile.participatedEvents",
                foreignField: "_id",
                as: "participatedEvents"
            }
        },
        {
            $match: {"_id": {$in: ids.map((id)=>{return mongoose.Types.ObjectId(id)})}}
        },
    ]);
    return query.exec().then((activists) => {
        return activists.map(a => {
            return {
                "_id": a._id,
                "metadata": a.metadata,
                "role": a.role,
                "profile": a.profile,
                "membership": a.membership,
                "participatedEvents": a.participatedEvents || [],
                "login": {
                    locked: a.login ? a.login.locked : false
                }
            };
        });
    });
};
const queryActivists = function(query, sortBy, page, callback){
    try{
      query = JSON.parse(query);
    }
    catch(err){
      console.log(err);
    }
    objectIdMapper.idifyObject(query);
    objectDateMapper.castDates(query);
    if(page < 0)
        return callback({"error":"illegal page"});
    const PAGE_SIZE = 50;
    const aggregation = Activist.aggregate([
        {
            $lookup: {
                from: 'events',
                localField: "profile.participatedEvents",
                foreignField: "_id",
                as: "linked.participatedEvents"
            }
        },
        {$match: query},
    ]);
    return Activist.aggregatePaginate(aggregation, {
            page: page + 1, limit: PAGE_SIZE,
            sort: sortBy ? sortBy : "profile.firstName",
        }
    ).then((result) => {
        const activists = result.docs;
        let activistsList = [];
        for(let activist of activists)
        {
            activistsList.push({
                "_id":activist._id,
                "phone":activist.profile.phone,
                "email":activist.profile.email,
                "name":activist.profile.firstName+" "+activist.profile.lastName,
                "city":activist.profile.residency,
                "isCaller":activist.role.isCaller,
                "participatedEvents":activist.linked.participatedEvents,
                "memberSince": activist.membership ? activist.membership.joiningDate : "",
            });
        }
        return callback({activists: activistsList, pageCount: result.totalPages, activistCount: result.totalDocs});
    });
};
const downloadActivistsByQuery = function(query, sortBy, callback){
    try{
        query = JSON.parse(query);
    }
    catch(err){
        console.log(err);
    }
    const sort = {};
    if(sortBy){
        const sortDir = sortBy.indexOf("-") === -1 ? 1 : -1;
        sortBy = sortBy ? sortBy.replace("-", "") : null;
        sort[sortBy]=sortDir;
    }
    else{
        sort["profile.firstName"] = 1;
    }
    objectIdMapper.idifyObject(query);
    objectDateMapper.castDates(query);
    Activist.aggregate([
        {
            $lookup: {
                from: 'events',
                localField: "profile.participatedEvents",
                foreignField: "_id",
                as: "linked.participatedEvents"
            }
        },
        {$match: query},
        {$sort : sort}
    ]).exec().then((activists) => {
        let activistsList = [];
        for(let activist of activists)
        {
            //add - to phone number, so that it won't be parsed as a number by excel
            let phone = activist.profile.phone ? activist.profile.phone.replace("-", "") : "";
            phone = phone.substring(0, 3) + "-" + phone.substring(3, phone.length + 4);
            activistsList.push({
                "phone": phone,
                "email": activist.profile.email,
                "firstName": activist.profile.firstName,
                "lastName": activist.profile.lastName,
                "city": activist.profile.residency,
                "isCaller": activist.role.isCaller,
                "creationDate": activist.metadata.creationDate,
                "circle": activist.profile.circle,
                "isMember": activist.profile.isMember,
                "isPaying": activist.profile.isPaying,
                "isNewsletter": activist.profile.isNewsletter,
                "memberSince": activist.membership ? activist.membership.joiningDate : "-",
                "tz": activist.membership ? activist.membership.TZ : "-",
                "street": activist.membership ? activist.membership.street : "-",
                "houseNum": activist.membership ? activist.membership.houseNum : "-",
                "apartmentNum": activist.membership ? activist.membership.apartmentNum : "-",
                "mailbox": activist.membership ? activist.membership.mailbox : "-",
                "birthday": activist.membership ? activist.membership.birthday : "-",
            });
        }
        return callback({activists: activistsList});
    });
};
const searchDuplicates = function(phones, emails){
    phones = phones.filter((p) => (p && p.length > 3));
    emails = emails.filter((e) => (e && e.length > 3));
    const query =  Activist.find({$or: [{"profile.phone":{$in:phones}}, {"profile.email":{$in:emails}}]});
    return query.exec().then((activists) => {
        let activistsList = [];
        for(let activist of activists)
        {
            activistsList.push({
                "_id":activist._id,
                "phone":activist.profile.phone,
                "email":activist.profile.email
            });
        }
        return activistsList;
    });
};
module.exports = {
    queryActivists,
    searchDuplicates,
    getActivistsByIds,
    downloadActivistsByQuery
};