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
const util = require('util');

const addToCircle = function(activist){
    if(!activist || !activist.profile.residency){
        return new Promise((resolve) => {resolve(activist)});
    }
    return circleMatcher.getCircleByCity(activist.profile.residency).then((circle)=>{
        if(!circle)
            return activist;
        activist.profile.circle = circle.name;
        if(activist.profile.circle && circle.mailchimpList) {
            mailchimpSync.createContacts([activist], circle.mailchimpList);
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
    let donation = await israelGivesSearch.searchDonationByEmail(activistData.email);
    //iterate over recent donations, look for one corresponding to the email of the new member
    logRegistration(activistData, donation);
    /*if(!donation && !development) {
        return {"err": "donation not found", "donation": false};
    }*/
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
    return activistDuplicateDetector.checkForDuplicates([activistObject]).then(()=>{
        //if there is a circle corresponding to the member's city, add it to their details
        //and add them to the appropriate mailchimp circle
        return addToCircle(activistObject).then(()=>{
            //if the new member already exists in our system
            if(activistObject.metadata.duplicateId){
                //update just the profile, membership, and lastUpdate fields - the rest might hold important information
                const query = Activist.updateOne({"_id": activistObject.metadata.duplicateId}, {$set: {
                        "profile": activistObject.profile,
                        "membership": activistObject.membership,
                        "metadata.lastUpdate": activistObject.metadata.lastUpdate
                    }});
                return query.exec().then(async () => {
                    const realDonations = (donation && donation.length) ? donation.filter(d => d.sum) : [];
                    let sum = 0;
                    if (realDonations.length) {
                        sum = realDonations[0].sum;
                    }
                    await notifyAdmins(activistData.firstName, activistData.lastName, sum, activistData.residency, activistObject.profile.circle, activistData.email, activistData.phone, activistData.birthday);
                    await notifyMember(activistData.email, activistData.firstName, activistData.lastName);
                    return true;
                }).catch((err)=>{
                    console.error(`updating member details in activists collection failed. message: ${err}`);
                    //catch errors updating the new member's details in our db
                    return {"err": "unknown error", "donation": true};
                });
            }
            else{
                //if the member doesn't already appear in our db
                return Activist.create(activistObject).then(async () => {
                    const realDonations = (donation && donation.length) ? donation.filter(d => d.sum) : [];
                    let sum = 0;
                    if (realDonations.length) {
                        sum = realDonations[0].sum;
                    }
                    await mailchimpSync.createContacts([activistData]);
                    await notifyAdmins(activistData.firstName, activistData.lastName, sum, activistData.residency, activistObject.profile.circle, activistData.email, activistData.phone, activistData.birthday);
                    await notifyMember(activistData.email, activistData.firstName, activistData.lastName);
                    return true;
                }).catch((err)=>{
                    console.error(`inserting member into activists collection failed. message: ${err}`);
                    //catch errors inserting the new member's details in our db
                    return {"err": "unknown error", "donation": true};
                });
            }
        }).catch((err)=>{
            console.error(`circle association failed. message: ${err}`);
            return {"err": "unknown error", "donation": true};
        });
    }).catch((err)=>{
        console.error(`duplicate detection failed. message: ${err}`);
        return {"err": "unknown error", "donation": true};
    });
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

const notifyMember = async function (email, firstName, lastName) {
    const htmlBody = membershipEmail.getEmail();
    const textBody = " \n" +
        "היי مرحبًا!\n" +
        "ברוכים הבאים לתנועת עומדים ביחד! שמחים שהצטרפת! רצינו, בכמה מילים, לספר לכם על התנועה שלנו – ושלך أهلًا وسهلًا بك في حراك نقف معًا! سعداء لانضمامك! نودّ أن نروي لك باختصار عن حراكنا - وحراكك\n" +
        " \n" +
        "\"עומדים ביחד\" היא תנועה פוליטית של מאבק ושל תקווה, בעלת ערכים סוציאליסטיים, ששותפים בה חברים וחברות מכל קצוות הארץ. אנחנו נאבקים למען שלום, עצמאות וצדק לשני העמים; למען שוויון מלא לכל מי שחיים בארץ הזו; למען צדק חברתי אמיתי. אנחנו תנועה דמוקרטית, שבה החברות והחברים הן שיוזמים את הפעילות, מובילים אותה, וגם יכולים לבחור ולהיבחר להנהגת התנועה.\n" +
        "\"نقف معًا\" هو حراك سياسي يسعى للنضال والأمل، يحمل قيمًا اشتراكية، ويتألف من أعضاء وعضوات من كل بقاع البلاد. نحن نناضل من أجل السلام، الاستقلالية والعدالة للشعبين؛ من أجل المساواة التامة لكل من يعيش في هذه البلاد؛ من أجل عدالة اجتماعية حقيقية. حراكنا ديمقراطي، يبادر لنشاطاته ويقودها العضوات والأعضاء، وبإمكانهم أيضًا الترشح والترشيح لقيادة الحراك.\n" +
        " \n" +
        " \n" +
        "אז מה אפשר לעשות עכשיו?\n" +
        "إذًا، ما الذي يمكنك فعله الآن؟\n" +
        " \n" +
        "1. להצטרף למעגל המקומי באזור מגוריך. עומדים ביחד פרושה כיום בתשעה מעגלי פעילות ברחבי הארץ, ושם מתחילה הפעילות שלנו. אם כבר קיים מעגל מקומי באזור שלך, אז ממש בקרוב יפנו אליך ויצרפו אותך לקבוצת הפעילות של המעגל. לא חייבים לקחת חלק בפעילות ובמעגל – אבל אנחנו בהחלט מעודדים את החברות והחברים שלנו להיות פעילים בתנועה. אם עוד אין מעגל באזור שלך, אז זה כמובן הזמן להתחיל ולבנות אותו, בליווי צוות האורגנייזינג של התנועה.\n" +
        "١. ألانضمام للحلقة المحلية بمنطقة سكنك. لنقف معًا اليوم تسع حلقات ناشطة في أنحاء البلاد، ومنها تبدأ نشاطاتنا. إن كانت هناك حلقة محلية في منطقة سكنك، فبالوقت القريب سيتمّ التواصل معك لضمّك لمجموعة العمل في الحلقة. لست مجبرًا على الانضمام للعمل وللحلقة - ولكننا حتمًا نشجع رفاقنا ورفيقاتنا على أن يكونوا ناشطين في الحراك. بحال عدم تواجد حلقة في منطقة سكنك، إذًا فهذا هو بالطبع الوقت الملائم للمباشرة ببنائها، وذلك بمرافقة طاقم التنظيم الحراكي.\n" +
        " \n" +
        "2. לומד/ת במכללה או באוניברסיטה? אפשר להירשם כאן וניצור קשר בהקדם, כדי לדבר איתך על הפעילות שלנו בקמפוסים.\n" +
        "٢. تتعلم/ين في كلية أو جامعة؟ يمكنك التسجيل هنا وسنتصل بك قريبًا، كي نتحدث معك عن أنشطتنا داخل مؤسسات التعليم العالي.\n" +
        " \n" +
        "3. רוצה לארח חוג בית? מעולה. כתבו לנו בחזרה ונתחיל ללכת על זה.\n" +
        "٣. ترغب/ين باستضافة لقاء بيتي؟ ممتاز. أكتبوا لنا ردًا على هذه الرسالة وسنخطط لذلك سويةً.\n" +
        " \n" +
        "4. למדו עוד על התנועה:\n" +
        "* ככה אנחנו פועלים בחברה הישראלית: קראו את מסמך תיאוריית השינוי של התנועה, שגובש בתהליך משותף ודמוקרטי בידי חברות וחברי התנועה מכל הארץ.\n" +
        "* ככה אנחנו מאורגנים: קראו את הכללים הארגוניים של התנועה, כדי לדעת מה המבנה שלה ואיך אפשר להשפיע. \n" +
        "٤. إعرفوا المزيد عن الحراك:\n" +
        "* نعمل داخل المجتمع الإسرائيلي على النحو التالي: إقرأوا وثيقة نظرية التغيير التي وضعها الحراك بعد عمل مشترك وديمقراطي قام به عضوات وأعضاء الحراك من أنحاء البلاد.\n" +
        "* نحن منظمون بهذا الشكل: إقرأوا القواعد التنظيمية للحراك، للتعرف على مبناه وكيفية التأثير داخله. \n" +
        " \n" +
        " \n" +
        "מחכים לראות אתכן ואתכם בשטח, במאבקים ובפגישות השוטפות,ننتظر لقاءكم ولقاءكن في الميدان، بالنضالات وبالاجتماعات الدورية،\n" +
        " \n" +
        "המזכירות של תנועת עומדים ביחד سكرتارية حراك نقف معًا";
    mailer.sendEmail({
        from: 'info@standing-together.org',
        to: email,
        subject: ' أهلًا وسهلًا بك في حراك نقف معًا! ברוכים הבאים לתנועת עומדים ביחד!',
        text: textBody,
        html: htmlBody
    });
};

module.exports = {
    updateMembership,
    registerMember
};
