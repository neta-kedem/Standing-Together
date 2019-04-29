const ContactScan = require('../models/contactScanModel');
const activistsFetcher = require("./activistsFetcher");
const eventFetcher = require("./eventFetcher");
const arrayFunctions = require("./arrayFunctions");

const COVERED_PERIOD = 5*24*60*60*1000;
const EMAIL_TO = ["yanivcogan89@gmail.com"];
const sendDailySummary = function(){
    return fetchRecentContactSheets().then((sheets)=>{
        return fetchEventsAndActivistsByContactSheets(sheets).then((events)=>{
            const emailBody = compileSummary(events);
            //TODO - send email to everyone on the EMAIL_TO list.
            return emailBody;
        })
    })
};
fetchRecentContactSheets = function(){
    const today = new Date();
    const cutoff = new Date(today.valueOf() - COVERED_PERIOD);
    return ContactScan.find(
        {$or:[{"metadata.creationDate": {$gt: cutoff}}, {"activists.creationDate": {$gt: cutoff}}]}
        ).exec().then((contactSheets)=> {
            return contactSheets;
        });
};
fetchEventsAndActivistsByContactSheets = function(sheets){
    let events = new Set();
    let activists = new Set();
    for(let i = 0; i < sheets.length; i++) {
        let sheet = sheets[i];
        events.add(sheet.eventId);
        activists.add(sheet.metadata.creatorId);
        for(let j = 0; j < sheet.activists.length; j++)
        {
            let activist = sheet.activists[j];
            activists.add(activist.activistId);
            activists.add(activist.typerId);
            console.log(activist.typerId);
        }
    }
    const activistsPromise = activistsFetcher.getActivistsByIds(Array.from(activists)).then((activistsData)=>{
        const activistDict = arrayFunctions.indexByField(activistsData, "_id");
        for(let i = 0; i < sheets.length; i++) {
            let sheet = sheets[i];
            sheet.creator = activistDict[sheet.metadata.creatorId];
            for(let j = 0; j < sheet.activists.length; j++)
            {
                let activist = sheet.activists[j];
                activist.activistDetails = activistDict[activist.activistId];
                activist.typerDetails = activistDict[activist.typerId];
                console.log(activist.typerDetails);
            }
        }
        return true;
    });
    const eventsPromise = eventFetcher.getEventsByIds(Array.from(events)).then((events)=>{
        let eventsData;
        eventsData = arrayFunctions.indexByField(events, "_id");
        for(let i = 0; i < sheets.length; i++) {
            let sheet = sheets[i];
            let eventId = sheet.eventId;
            //check for missing events
            if(!eventsData[eventId]){
                console.log("error! this shouldn't happen. Some event wasn't fetched properly when compiling daily email");
            }
            if(eventsData[eventId].sheets === undefined){
                eventsData[eventId].sheets = [];
            }
            eventsData[eventId].sheets.push(sheet);
        }
        return eventsData;
    });
    return Promise.all([eventsPromise, activistsPromise]).then((results)=>{
        return Object.values(results[0]);
    });
};

compileSummary = function(events){
    let result = "";
    const today = new Date();
    const cutoff = new Date(today.valueOf()-COVERED_PERIOD);
    const eventCount = events.length;
    let sheetCount = 0;
    let contactCount = 0;
    let newContactsCount = 0;
    let cityCounter = {};
    //iterate over contact events
    for(let k = 0; k < events.length; k++)
    {
        //there are two "levels" named eventDetails - we have to go through both.
        //the first one distinguishes data from the events collection from data from the sheets collection
        //the second is simply the eventDetails sub-document specified in the event model.
        let event = events[k];
        let contactSheets = event.sheets;
        let eventName = event.eventDetails.name;
        let eventDate = new Date(event.eventDetails.date).toISOString().split('T')[0];
        let eventLocation = event.eventDetails.location;
        result += "סיכום הפעילות היומית בנוגע לאירוע " + eventName + " שנערך ב-" + eventDate + ", ב" + eventLocation + ": \n";
        //iterate over contact sheets
        for(let i = 0; i < contactSheets.length; i++){
            sheetCount++;
            let contactSheet = contactSheets[i];
            //TODO - replace with more relevant info
            let uploader = contactSheet.creator.profile.firstName + " " + contactSheet.creator.profile.lastName;
            let uploadDate = new Date(contactSheet.metadata.creationDate).toISOString().split('T')[0];
            let uploadTime = new Date(contactSheet.metadata.creationDate).toTimeString().split(' ')[0];
            if(contactSheet.metadata.creationDate > cutoff){
                result += "הועלה דף קשר חדש למערכת ע\"י " + uploader + ", בשעה " + uploadTime + "\n";
            }
            else{
                result += "הוקלדו אנשי קשר מדף שהועלה ע\"י " + uploader + ", בתאריך " + uploadDate + ", במסגרת האירוע " + event.eventDetails.name + "\n";
            }
            //lists the details of contacts who were typed in *as part of to the current contact sheet*
            let newContactsInSheet = [];
            let existingContactsInSheet = [];
            for(let j = 0; j < contactSheet.activists.length; j++){
                let activist = contactSheet.activists[j];
                if(activist.creationDate > cutoff){
                    //whether the contact was determined to have already existed in our system
                    let isNew = activist.new;
                    contactCount++;
                    if(isNew){
                        newContactsInSheet.push(activist);
                        newContactsCount++;
                        let currCity = activist.activistDetails.profile.residency;
                        if(currCity && currCity.length > 1)
                            cityCounter[currCity] = cityCounter[currCity] === undefined ? 1 : cityCounter[currCity] +1;
                    }
                    else{
                        existingContactsInSheet.push(activist);
                    }
                }
            }
            if(newContactsInSheet.length || existingContactsInSheet.length)
            {
                result += "בסה\"כ הוקלדו הפרטים של " + (newContactsInSheet.length + existingContactsInSheet.length) +
                    " משתתפות באירוע. מתוכן, " + newContactsInSheet.length + " הוזנו למערכת בפעם הראשונה." + "\n";
            }
            else{
                result += "טרם הוקלדו רשומות לפי דף הקשר הזה" + "\n";
            }
            if(newContactsInSheet.length)
            {
                result += "משתתפות שלא הופיעו במערכת עד עכשיו:" + "\n";
                for(let j = 0; j < newContactsInSheet.length; j++){
                    let activist = newContactsInSheet[j];
                    let activistDetails = activist.activistDetails;
                    let typerDetails = activist.typerDetails;
                    //the comments left by the typer when inputting the data about the contact
                    let comments = activist.comments;
                    result += "     " + activistDetails.profile.firstName + " " + activistDetails.profile.lastName + " מ" + activistDetails.profile.residency;
                    result += ", הפרטים הוקלדו על ידי " + typerDetails.profile.firstName + " " + typerDetails.profile.lastName;
                    if(comments && comments.length){
                        result += " (הערה - " + comments + ")"
                    }
                    result += "\n";
                }
            }
            if(existingContactsInSheet.length)
            {
                result += "משתתפות שכבר הופיעו במערכת בעבר:" + "\n";
                for(let j = 0; j < existingContactsInSheet.length; j++){
                    let activist = existingContactsInSheet[j];
                    let activistDetails = activist.activistDetails;
                    let typerDetails = activist.typerDetails;
                    result += "     " + activistDetails.profile.firstName + " " + activistDetails.profile.lastName + " מ" + activistDetails.profile.residency;
                    result += ", הפרטים הוקלדו על ידי " + typerDetails.profile.firstName + " " + typerDetails.profile.lastName;
                }
            }
            result += "\n";
        }
        result += "\n";
    }
    result += "\n";
    result += "**************************\n";
    result += "לסיכום, במהלך היום הוקלדו " + sheetCount + " דפי קשר, ";
    if(eventCount > 1)
        result += "מ" + eventCount + " אירועים שונים, ";
    result += "בסך הכל הפרטים של " + contactCount + " משתתפות הוקלדו, מתוכן " + newContactsCount + " שנוספו למערכת לראשונה";
    result += "\n";
    const citiesByPopularity = Object.keys(cityCounter).map((city)=>{
        return {city: city, numOfNewContacts: cityCounter[city]};
    }).sort((a, b)=>{
        return b.numOfNewContacts - a.numOfNewContacts;
    });
    result += "מבין אלו שנוספו לראשונה היום למערכת: " + "\n";
    for(let i = 0; i < Math.min(citiesByPopularity.length, 3); i++){
        let city = citiesByPopularity[i];
        result += city.numOfNewContacts + " מ" + city.city + "\n";
    }
    return result;
};

module.exports = {
    sendDailySummary
};