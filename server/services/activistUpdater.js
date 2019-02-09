const mongoose = require('mongoose');
const Activist = require('../models/activistModel');
const ContactScan = require('../models/contactScanModel');
const Authentication = require('../services/authentication');
const markTypedContactScanRows = function(res, typerId, scanId, activists, markedDone){
    scanId = mongoose.Types.ObjectId(scanId);
    ContactScan.findOne(
        {"_id": scanId},
        (err, scanData) => {
            if (err) return res.json({success: false, error: err});
            //iterate over new activist entries, and insert typer id and activist id details to appropriate rows
            for(let i=0; i<activists.length; i++){
                let activist = activists[i];
                if(activist.metadata.scanRow) {
                    scanData.rows[activist.metadata.scanRow].typerId = typerId;
                    scanData.rows[activist.metadata.scanRow].activistId = activist._id;
                }
            }
            //iterate over all scan rows - if all have an activist id associated with them, mark the scan as completed
            let allRowsTyped = true;
            for(let i=0; i<scanData.rows.length; i++){
                if(!scanData.rows[i].activistId)
                {
                    allRowsTyped=false;
                    break;
                }
            }
            // if the scan went through row detection, mark it as finished IFF all rows have a correspondings typed in data.
            // otherwise, mark it as finished IFF the typer has indicated it to be
            scanData.complete=(scanData.rows.length&&allRowsTyped)||markedDone;
            ContactScan.replaceOne(
                {"_id": scanId},
                scanData,
                (err, result) => {
                    if (err){
                        return res.json(err);
                    }
                    return res.json(result);
                }
            );
        });
};
const insertActivists = function(req, res){
    const newActivist = new Activist(req.body);
    newActivist.save(function (err) {
        if (err){
            return res.json(err);
        }
        else
            return res.json(req.body);
    });
};
const toggleActivistStatus = function(req, res){
    Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const activistId = req.body.activistId;
        const isCaller = req.body.status;
        let query = Activist.update({'_id':activistId},{'role.isCaller': isCaller});
        return query.exec().then(()=>{
            return res.json({"result":"set status to "+isCaller+" for user "+activistId});
        });
    });
};
const uploadTypedActivists = function (req, res){
    Authentication.hasRole(req, res, "isTyper").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const typerId = Authentication.getMyId();
        const typedActivists = req.body.activists;
        const scanUrl = req.body.scanUrl;
        const scanId = req.body.scanId;
        const markedDone = req.body.markedDone;
        let processedActivists = [];
        const today = new Date();
        for (let i=0; i<typedActivists.length; i++)
        {
            let curr = typedActivists[i];
            processedActivists.push(
                {
                    "_id": mongoose.Types.ObjectId(),
                    "metadata" : {
                        "creationDate" : today,
                        "lastUpdate" : today,
                        "joiningMethod" : "contactPage",
                        "typerName" : "Yaniv Cogan",
                        "scanUrl": scanUrl,
                        "scanRow": curr.scanRow
                    },
                    "profile" : {
                        "firstName" : curr.firstName,
                        "lastName" : curr.lastName,
                        "phone" : curr.phone.replace(/[\-.():]/g, ''),
                        "email" : curr.email,
                        "residency" : curr.residency,
                        "circle" : "תל-אביב",
                        "isMember" : false,
                        "isPaying" : false,
                        "isNewsletter" : false,
                        "participatedEvents" : []
                    },
                    "role" : {
                        "isTyper" : false,
                        "isCaller" : false,
                        "isOrganizer" : false,
                        "isCircleLeader" : false
                    },
                    "login" : {
                        "loginCode" : null,
                        "token" : []
                    }
                }
            );
        }
        Activist.insertMany(processedActivists).then(function (result) {
            if (result){
                if(scanId){
                    markTypedContactScanRows(res, typerId, scanId, processedActivists, markedDone);
                }
                else{
                    return res.json(result);
                }
            }
            else{
                return res.json({"error":"an unknown error has occurred, the activists were not saved"});
            }
        });
    });
};

module.exports = {
    uploadTypedActivists,
    toggleActivistStatus,
    insertActivists
};