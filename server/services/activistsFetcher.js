const Activist = require('../models/activistModel');
const Authentication = require('../services/authentication');
const getActivists = function (req, res){
    Authentication.isUser(req, res).then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        Activist.find((err, activists) => {
            if (err) return res.json({success: false, error: err});
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
                    "lastEvent":activist.profile.participatedEvents[activist.profile.participatedEvents.length-1]
                });
            }
            return res.json(activistsList);
        });
    })
};
const queryActivists = function(req, res){
    Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const query = req.body.query;
        Activist.find(query, (err, activists) => {
            if (err) return res.json({success: false, error: err});
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
                    "lastEvent":activist.profile.participatedEvents[activist.profile.participatedEvents.length-1]
                });
            }
            return res.json(activistsList);
        });
    })
};

module.exports = {
    getActivists,
    queryActivists
};