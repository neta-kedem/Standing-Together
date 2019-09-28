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

setQR = async (page) => {
    const now = new Date();
    try {
        const src = await page.evaluate(() => {
            const qrImg = document.querySelector("img[alt='Scan me!']");
            return qrImg ? qrImg.src : null;
        });
        const query = WhatsappSession.updateOne(
            {"_id": sessionId},
            {"$set": {"metadata.lastUpdate": now, qrUrl: src}});
        return query.exec().then(
            (err, result) => {
                return {"err":err, "result":result};
            });
    }
    catch(err){
        console.log(err)
    }
};

setProfileImage = async (src) => {
    const now = new Date();
    const query = WhatsappSession.updateOne(
        {"_id": sessionId},
        {"$set": {"metadata.lastUpdate": now, profileImg: src}});
    return query.exec().then(
        (err, result) => {
            return {"err":err, "result":result};
        });
};

setProgress = async (processedCount) => {
    const now = new Date();
    const query = WhatsappSession.updateOne(
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
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    page.setDefaultTimeout(10000000);
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');
    await page.goto('https://web.whatsapp.com');
    await page.waitForSelector("img[alt='Scan me!']");
    setQR(page);
    const qrInterval = setInterval(() => {
        setQR(page);
    }, 1000);
    await page.waitForSelector("img[src*='https://web.whatsapp.com/pp?']");
    clearInterval(qrInterval);
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
        await page.evaluate(() => {
            window.onbeforeunload = null;
            return true;
        });
        await page.goto("https://web.whatsapp.com/send?phone=" + message.number + "&text=" + message.message);
        await page.waitForSelector("div.copyable-text");
        await page.evaluate(() => {
            document.querySelector("span[data-icon='send']").parentElement.click();
            window.onbeforeunload = null;
            return true;
        });
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

