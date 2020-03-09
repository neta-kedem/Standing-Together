const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const WhatsappSession = require('../models/whatsappSessionModel');
const Authentication = require('./authentication');

const CANCEL_AFTER_NO_PING_DURATION = 1000 *60 * 60;
let browser = null;
let sessionId = null;
let currentContactIndex = 0;

createSession = async (messages, clientSessionId) => {
    const today = new Date();
    const userId = Authentication.getMyId();
    const session={
        "_id": mongoose.Types.ObjectId(clientSessionId),
        "metadata":{
            "creationDate": today,
            "lastUpdate": today,
            "userId": userId
        },
        "contactCount": messages.length
    };
    sessionId = session._id;
    return WhatsappSession.create(session).then((res, err)=>{
        return true;
    });
};

setQR = async (page) => {
    const now = new Date();
    try {
        const src = await page.evaluate(() => {
            const qrImg = document.querySelector("canvas[aria-label='Scan me!']");
            return qrImg ? qrImg.toDataURL() : null;
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
        console.error(`setQR failed. message ${err}`)
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

setProgress = async (processedCount, success) => {
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
    if(browser){
        browser.close();
    }
    return WhatsappSession.deleteMany({_id: sessionId}).exec().then(()=>true);
};

sendMessage = async (messages, sessionId) => {
    const session = await createSession(messages, sessionId);
    browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.setDefaultTimeout(10000000);
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');
    await page.goto('https://web.whatsapp.com');
    await page.waitForSelector("canvas[aria-label='Scan me!']");
    setQR(page);
    const qrInterval = setInterval(() => {
        checkPing();
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
        const isClientActive = await checkPing();
        if(!isClientActive){
            return;
        }
        await page.evaluate(() => {
            window.onbeforeunload = null;
            console.log("here");
            console.log("here");
            document.body.innerHTML += "<a id='whatsapp-link' href='https://web.whatsapp.com/send?phone="
                + message.number + "&text=" + message.message +"'>test</a>";
            document.querySelector("#whatsapp-link").click();
            return true;
        });
        await page.goto("https://web.whatsapp.com/send?phone=" + message.number + "&text=" + message.message);
        await page.waitFor(() =>
            document.querySelectorAll('div.copyable-text').length||Array.from(document.querySelectorAll('div')).find(element => element.textContent === 'Phone number shared via url is invalid.')
        );
        const success = await page.evaluate(async () => {
            /*const invalidNumber = Array.from(document.querySelectorAll('div')).find(element => element.textContent === 'Phone number shared via url is invalid.');
            if(invalidNumber){
                window.onbeforeunload = null;
                console.log("\n\n\n\n\n\n\n\n HUH");
                console.log(invalidNumber);
                return false;
            }*/
            await(new Promise(resolve => setTimeout(resolve, 100)));
            try{
                document.querySelector("span[data-icon='send']").parentElement.click()
            }
            catch(e){
                console.log(e);
            }
            window.onbeforeunload = null;
            return true;
        });
        await setProgress(i + 1, success);
    }
    await closeSession();
    return true;
};

//if you ever want to implement a "pause" mechanism, do it here
checkPing = async () => {
    if(!sessionId)
        return;
    const query = WhatsappSession.findOne({_id: mongoose.Types.ObjectId(sessionId)});
    return query.exec().then((session) => {
        if(session && session.metadata && session.metadata.lastPing){
            const lastPing = new Date(session.metadata.lastPing);
            if(lastPing < new Date() - CANCEL_AFTER_NO_PING_DURATION){
                closeSession();
                return false;
            }
            //pause mechanism pseudo code:
            //if the session is paused, set a time out to recursively call this function in 2 seconds, and return it's promise
            return true;
        }
    });
};

pingSession = async (sessionId) => {
    const query = WhatsappSession.findOneAndUpdate({_id: mongoose.Types.ObjectId(sessionId)}, {$set: {"metadata.lastPing": new Date()}});
    return query.exec().then((session) => {
        return session
    });
};

startSending = async (sessionId) => {
    const query = WhatsappSession.updateOne(
        {"_id": sessionId},
        {"$set": {"metadata.lastUpdate": now, qrUrl: src}});
    return query.exec().then(
        (err, result) => {
            return {"err":err, "result":result};
        });
};
module.exports = {
    sendMessage,
    pingSession,
};

