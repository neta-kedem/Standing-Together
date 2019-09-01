const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const WhatsappSession = require('../models/whatsappSessionModel');
const Authentication = require('./authentication');

let sessionId = null;

createSession = async (messages) => {
    const today = new Date();
    const userId = Authentication.getMyId();
    const session={
        "_id": mongoose.Types.ObjectId(),
        "metadata":{
            "creationDate": today,
            "lastUpdate": today,
            "userId": userId
        },
        "contactCount": messages.length
    };
    return WhatsappSession.create(session).then((res, err)=>{
        console.log(err);
        sessionId = session._id;
        return true;
    });
};

setQR = async (src) => {
    const now = new Date();
    const query = WhatsappSession.update(
        {"_id": sessionId},
        {"$set": {"metadata.lastUpdate": now, qrUrl: src}});
    return query.exec().then(
        (err, result) => {
            return {"err":err, "result":result};
        });
};

setProfileImage = async (src) => {
    const now = new Date();
    const query = WhatsappSession.update(
        {"_id": sessionId},
        {"$set": {"metadata.lastUpdate": now, profileImg: src}});
    return query.exec().then(
        (err, result) => {
            return {"err":err, "result":result};
        });
};

setProgress = async (processedCount) => {
    const now = new Date();
    const query = WhatsappSession.update(
        {"_id": sessionId},
        {"$set": {"metadata.lastUpdate": now, processedContactCount: processedCount}});
    return query.exec().then(
        (err, result) => {
            return {"err":err, "result":result};
        });
};

closeSession = async () => {
    return WhatsappSession.deleteMany({_id: sessionId}).exec().then(()=>true);
};

sendMessage = async (messages) => {
    const session = await createSession(messages);
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');
    await page.goto('https://web.whatsapp.com');
    await page.waitForSelector("img[alt='Scan me!']");
    const qr = await page.evaluate(()=>{
        const qrImg = document.querySelector("img[alt='Scan me!']");
        return qrImg.src;
    });
    setQR(qr);
    await page.waitForSelector("img[src*='https://web.whatsapp.com/pp?']");
    const profileImg = await page.evaluate(()=>{
        const profileImg = document.querySelector("img[src*='https://web.whatsapp.com/pp?']");
        return profileImg.src;
    });
    setProfileImage(profileImg);
    for(let i = 0; i < messages.length; i++){
        let message = messages[i];
        if(!message.number || !message.number.length){
            continue;
        }
        await page.goto("https://web.whatsapp.com/send?phone=" + message.number + "&text=" + message.message);
        await page.waitForSelector("div.copyable-text");
        await page.type(String.fromCharCode(13), "");
        await page.keyboard.press(String.fromCharCode(13));
        await setProgress(i + 1);
    }
    await browser.close();
    await closeSession();
    return true;
};

getProgress = async () => {
    const query = WhatsappSession.findOne({"metadata.userId": mongoose.Types.ObjectId(Authentication.getMyId())});
    return query.exec().then((session) => {
        return session
    });
};
module.exports = {
    sendMessage,
    getProgress
};

