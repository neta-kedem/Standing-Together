const mongoose = require('mongoose');
const Activist = require('../models/activistModel');
const mailchimpSync = require('../services/mailchimpSync');
const circleMatcher = require("./circleMatcher");
const activistDuplicateDetector = require("./activistDuplicateDetector");
const israelGivesPost = require("./israelGivesPost");

const addToCircle = function(activists){
    if(!activists || !activists.length){
        return true;
    }
    return circleMatcher.initMatcher().then(()=>{
        let updatePromises = [];
        for(let i = 0; i < activists.length; i++){
            let curr = activists[i];
            let circle = circleMatcher.getCircleByCity(curr.profile.residency);
            curr.profile.circle = circle._id;
            if(curr.profile.circle)
                updatePromises.push(mailchimpSync.createContacts([curr], circle.mailchimpList));
        }
        return Promise.all(updatePromises);
    });
};
const registerMember = function (activistData, paymentData){
        const today = new Date();
        const activistObject = {
            "_id": mongoose.Types.ObjectId(),
            "metadata" : {
                "creationDate" : today,
                "lastUpdate" : today,
                "joiningMethod" : "memberPage",
            },
            "profile" : {
                "firstName" : activistData.firstName,
                "lastName" : activistData.lastName,
                "phone" : activistData.phone.replace(/[\-.():]/g, ''),
                "email" : activistData.email,
                "residency" : activistData.residency,
                "isMember" : true,
                "isPaying" : true
            },
            "membership" : {
                "joiningDate" : today,
                "street" : activistData.street,
                "houseNum" : activistData.houseNum,
                "apartmentNum" : activistData.apartmentNum,
                "mailbox" : activistData.mailbox,
                "TZ" : activistData.tz,
                "birthday" : activistData.birthday,
                "transactionId" : 123
            },
            "role" : {
                "isTyper" : false,
                "isCaller" : false,
                "isOrganizer" : false,
                "isCircleLeader" : false
            }
        };
        const paymentObject = {
            DonorTitle: "",
            DonorFirstName: activistData.firstName,
            DonorLastName: activistData.lastName,
            DonorAddress1: activistData.street + " " + activistData.houseNum + ", " + activistData.apartmentNum + ", ת.ד. " + activistData.mailbox,
            DonorCity: activistData.residency,
            DonorCountryId: "104",
            DonorEmail: activistData.email,
            DonorTelephone: activistData.phone.replace(/[\-.():]/g, ''),
            DonationSums: paymentData.selectedAmount,
            DonationTargetTypes: "1",
            DonationTargetIds: "580484681",
            DonationFrequency: "2",
            CurrencyId: "1",
            CardTypeId: paymentData.CardTypeId,
            CreditCardNo: paymentData.CreditCardNo,
            CVV: paymentData.CVV,
            ExpirationYear: paymentData.year,
            ExpirationMonth: paymentData.month,
            LanguageId: "1"
        };
        console.log(paymentObject);
        return;
        //detect activists in our system that share a phone/email with the new member
        return activistDuplicateDetector.checkForDuplicates([activistObject]).then(()=>{
            //if there is a circle corresponding to the member's city, add it to their details
            //and add them to the appropriate mailchimp circle
            return addToCircle([activistObject]).then(()=>{
                //if the new member already exists in our system
                if(activistObject.metadata.duplicateId){
                    //update just the profile, membership, and lastUpdate fields - the rest might hold important information
                    const query = Activist.updateOne({"_id": activistObject.metadata.duplicateId}, {$set: {
                            $set: {"profile": activistObject.profile},
                            "membership": activistObject.membership,
                            "metadata.lastUpdate": activistObject.metadata.lastUpdate
                        }});
                    query.exec().then((result)=>{
                        //pay for their membership
                        israelGivesPost.payForMembership(paymentObject).then((result)=>{
                            return result;
                        }).catch((err)=>{
                            //catch errors initiating the payment
                            return err;
                        });
                    }).catch((err)=>{
                        //catch errors updating the new member's details in our db
                        return err;
                    });
                }
                else{
                    //if the member doesn't already appear in our db
                    return Activist.create(activistObject).then((result)=>{
                        //pay for their membership
                        israelGivesPost.payForMembership(paymentObject).then((result)=>{
                            return result;
                        }).catch((err)=>{
                            //catch errors initiating the payment
                            return err;
                        });
                    }).catch((err)=>{
                        //catch errors inserting the new member's details in our db
                        return err;
                    });
                }
            });
        });
};

module.exports = {
    registerMember
};