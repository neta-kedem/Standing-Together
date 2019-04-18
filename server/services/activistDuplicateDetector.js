const Activist = require('../models/activistModel');
const arrayFunctions = require("./arrayFunctions");
/**
 * @param phones
 * @param emails
 * @returns {*} a list of activists from our system that matches either one of the phones or emails supplied - only the emails, phones, and _ids are returned
 */
const searchDuplicates = function(phones, emails){
    const query =  Activist.find({$or: [{"profile.phone":{$in:phones}}, {"profile.email":{$in:emails}}]});
    const duplicatesPromise = query.exec().then((activists) => {
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
    return duplicatesPromise;
};
/**
 * @param activists
 * @returns activists - assigns a duplicateId field to every activist in the input array, pointing to the _id of the original activist
 */
const checkForDuplicates = function (activists){
    const phones = activists.map((a)=>{return a.profile.phone}).filter(phone => phone && phone.length > 3);
    const emails = activists.map((a)=>{return a.profile.email}).filter(email => email && email.length > 3);
    const duplicates = searchDuplicates(phones, emails).then(duplicates => {
        const duplicatesByPhone = arrayFunctions.indexByField(duplicates, "phone");
        const duplicatesByEmail = arrayFunctions.indexByField(duplicates, "email");
        for(let i = 0; i < activists.length; i++){
            if(duplicatesByPhone[activists[i].profile.phone]){
                activists[i].metadata.duplicateId = duplicatesByPhone[activists[i].profile.phone]._id;
            }
            if(duplicatesByEmail[activists[i].profile.email]){
                activists[i].metadata.duplicateId = duplicatesByEmail[activists[i].profile.email]._id;
            }
        }
        return activists;
    });
    return duplicates;
};
module.exports = {
    checkForDuplicates
};