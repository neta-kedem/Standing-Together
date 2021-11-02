const mongoose = require('mongoose');
const Activist = require('../models/activistModel');
const MemberRegistrationLog = require('../models/memberRegistrationModel');
const mailchimpSync = require('../services/mailchimpSync');
const mailer = require("./mailer");
const settingsManager = require("./settingsManager");
const circleMatcher = require("./circleMatcher");
const activistDuplicateDetector = require("./activistDuplicateDetector");
const israelGivesSearch = require("./israelGivesSearch");
const membershipEmail = require("./membershipEmail");
const activistFetcher = require("./activistsFetcher");

const addToCircle = function(activist){
    if(!activist || !activist.profile.residency){
        return new Promise((resolve) => {resolve(activist)});
    }
    return circleMatcher.getCircleByCity(activist.profile.residency).then((circle)=>{
        if(!circle)
            return activist;
        activist.profile.circle = circle.name;
        if(activist.profile.circle && circle.mailchimpList) {
            //mailchimpSync.createContacts([activist], circle.mailchimpList);
        }
        return activist;
    });
};

const logRegistration = function(activistData, donationId) {
    MemberRegistrationLog.create(
        {
            date: new Date(),
            donationId: JSON.stringify(donationId),
            data: JSON.stringify(activistData)
        }
    );
};

const updateMembership = async (activistId) => {
    try {
        logRegistration(activistId, {});
        const today = new Date();
        const activistDatas = await activistFetcher.getActivistsByIds([activistId])
        const activistData = activistDatas[0];
        const activistObject = {
            "_id": mongoose.Types.ObjectId(),
            "metadata": {
                "lastUpdate": today,
                "joiningMethod": "manual",
            },
            "profile": {
                "firstName": activistData.profile.firstName,
                "lastName": activistData.profile.lastName,
                "phone": activistData.profile.phone.replace(/[\-.():]/g, ''),
                "email": activistData.profile.email.toLowerCase(),
                "residency": activistData.profile.residency,
                "isMember": true,
                "isPaying": activistData.profile.isPaying
            },
            "membership": {
                "joiningDate": today,
            },
        };
        const query = Activist.updateOne({"_id": activistId}, {
            $set: {
                "profile": activistObject.profile,
                "membership": activistObject.membership,
                "metadata.lastUpdate": activistObject.metadata.lastUpdate
            }
        });
        await query.exec()
        await notifyAdmins(activistData.firstName, activistData.lastName, 0, activistData.residency, activistData.profile.circle, activistData.email, activistData.phone, activistData.birthday);
        await notifyMember(activistData.email, activistData.firstName, activistData.lastName);
        activistData.membership = activistObject.membership
        activistData.metadata = activistObject.metadata
        return activistData;
    } catch(error) {
        console.error('failed updating membership to user '+ activistId, error)
    }
}
const registerMember = async function (activistData){
    const development = process.env.NODE_ENV === 'development';
    // let donation = await israelGivesSearch.searchDonationByEmail(activistData.email);
    // iterate over recent donations, look for one corresponding to the email of the new member
    logRegistration(activistData, {});
    /*if(!donation && !development) {
        return {"err": "donation not found", "donation": false};
    }*/
    const sum = activistData.sum;
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
            "email" : activistData.email.toLowerCase(),
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
            "transactionId" : null
        },
        "role" : {
            "isTyper" : false,
            "isCaller" : false,
            "isOrganizer" : false,
            "isCircleLeader" : false
        }
    };
    //detect activists in our system that share a phone/email with the new member
    await activistDuplicateDetector.checkForDuplicates([activistObject]);
    //if there is a circle corresponding to the member's city, add it to their details
    //and add them to the appropriate mailchimp circle
    await addToCircle(activistObject);
    //if the new member already exists in our system
    if(activistObject.metadata.duplicateId){
        //update just the profile, membership, and lastUpdate fields - the rest might hold important information
        const query = Activist.updateOne({"_id": activistObject.metadata.duplicateId}, {$set: {
                "profile": activistObject.profile,
                "membership": activistObject.membership,
                "metadata.lastUpdate": activistObject.metadata.lastUpdate
            }});
        await query.exec();
        await notifyAdmins(activistData.firstName, activistData.lastName, sum, activistData.residency, activistObject.profile.circle, activistData.email, activistData.phone, activistData.birthday);
    }
    else {
        //if the member doesn't already appear in our db
        await Activist.create(activistObject);
        // await mailchimpSync.createContacts([activistData]);
        await notifyAdmins(activistData.firstName, activistData.lastName, sum, activistData.residency, activistObject.profile.circle, activistData.email, activistData.phone, activistData.birthday);
    }
    return true;
};

const notifyAdmins = async function (firstName, lastName, sum, residency, circle, email, phone, birthday) {
    const today = new Date();
    const recipients = await settingsManager.getSettingByName("newMemberAlertRecipients");
    const htmlBody = `
    <div dir="rtl" style="text-align: right;">
        <h3 style="color: #60076e">
            ${firstName} ${lastName} נרשמה לתנועה 
        </h3>
        <p>ההרשמה התבצעה בתאריך ${today.getUTCFullYear() + "-" + (today.getUTCMonth() + 1) + "-" + today.getUTCDate()}</p>
        <p>דמי החבר החודשיים: ${sum}₪</p>
        </br>
        <p>החברה החדשה מתגוררת ב${residency}, וצורפה אוטומטית למעגל ${circle}.</p>
        <p>אפשר ליצור איתה קשר במייל ${email} או בטלפון ${phone}</p>
        <p>נולדה ב-: ${birthday}</p>
    </div>
    `;
    const textBody = `${firstName} ${lastName} נרשמה לתנועה 
      ההרשמה התבצעה בתאריך ${today.getUTCFullYear() + "-" + (today.getUTCMonth() + 1) + "-" + today.getUTCDate()}
      דמי החבר החודשיים: ${sum}₪
      
      החברה החדשה מתגוררת ב${residency}, וצורפה אוטומטית למעגל ${circle}.
      אפשר ליצור איתה קשר במייל ${email} או בטלפון ${phone}
    `;
    mailer.sendEmail({
        from: 'info@standing-together.org',
        to: recipients.join(", "),
        subject: '✊ חבר/ה חדש/ה נרשמ/ה לתנועה! ✊',
        text: textBody,
        html: htmlBody
    });
};

module.exports = {
    updateMembership,
    registerMember,
    logRegistration,
    notifyAdmins,
    notifyMember
};
