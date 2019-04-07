const mongoose = require('mongoose');
const Authentication = require('../services/authentication');
const ContactScan = require('../models/contactScanModel');

const insertContactScan = function(req, res){
    Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const scanUrl = req.body.scanUrl;
        //the cells info as received from the client (i.e. [[{x,y},{x,y},{x,y},{x,y}]...]
        const cells = req.body.cells;
        //constructing the cells info as required by the schema (i.e. [{corners:[{x,y},{x,y},{x,y},{x,y}]}...]
        let cellsObject = [];
        for (let i=0; i<cells.length; i++)
        {
            cellsObject[i]={"cells":[]};
            for(let j=0; j<cells[i].length; j++)
            {
                cellsObject[i].cells.push({"corners":cells[i][j]});
            }
        }
        const today = new Date();
        const scanObject={
            "metadata":{
                "creationDate": today,
                "lastUpdate": today,
                "creatorId": Authentication.getMyId()
            },
            "scanUrl":scanUrl,
            "rows":cellsObject
        };
        const newScan = new ContactScan(scanObject);
        newScan.save(function (err) {
            if (err){
                return res.json(err);
            }
            else
                return res.json(req.body);
        });
    })
};
const pingScan = function(req, res){
    Authentication.hasRole(req, res, "isTyper").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const scanId = mongoose.Types.ObjectId(req.body.scanId);
        const now = new Date();
        ContactScan.update(
            {"_id": scanId},
            {"$set": {"lastPing": now}},
            (err, result) => {
                return res.json({"err":err, "result":result});
            }
        );
    });
};

module.exports = {
    insertContactScan,
    pingScan
};

