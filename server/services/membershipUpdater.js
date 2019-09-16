const mongoose = require('mongoose');
const Activist = require('../models/activistModel');
const MemberRegistrationLog = require('../models/memberRegistrationModel');
const mailchimpSync = require('../services/mailchimpSync');
const mailer = require("./mailer");
const settingsManager = require("./settingsManager");
const circleMatcher = require("./circleMatcher");
const activistDuplicateDetector = require("./activistDuplicateDetector");
const israelGivesSearch = require("./israelGivesSearch");
const util = require('util');

const addToCircle = function(activist){
    if(!activist || !activist.profile.residency){
        return new Promise((resolve) => {resolve(activist)});
    }
    return circleMatcher.getCircleByCity(activist.city).then((circle)=>{
        if(!circle)
            return activist;
        activist.profile.circle = circle._id;
        if(activist.profile.circle && circle.mailchimpList)
            activist.push(mailchimpSync.createContacts([activist], circle.mailchimpList));
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

const registerMember = async function (activistData){
    let donation = null;
    const recentDonations = await israelGivesSearch.getRecentDonations();
    //iterate over recent donations, look for one corresponding to the email of the new member
    for(let i = 0; i < recentDonations.length; i++){
        if(!recentDonations[i] || !recentDonations[i]["donor_email"] || !recentDonations[i]["donor_email"]["#cdata-section"])
            continue;
        let currEmail = recentDonations[i]["donor_email"]["#cdata-section"].toLowerCase();
        if(currEmail === activistData.email.toLowerCase()) {
            donation = recentDonations[i].donation;
            //console.log(util.inspect(donation, {showHidden: false, depth: null}));
        }
    }
    logRegistration(activistData, donation);
    if(!donation) {
        return {"err": "donation not found"};
    }
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
                    await notifyAdmins(activistData.firstName, activistData.lastName, sum);
                    await notifyMember(activistData.email, activistData.firstName, activistData.lastName);
                    return true;
                }).catch((err)=>{
                    console.log(err);
                    //catch errors updating the new member's details in our db
                    return err;
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
                    await notifyAdmins(activistData.firstName, activistData.lastName, sum);
                    await notifyMember(activistData.email, activistData.firstName, activistData.lastName);
                    return true;
                }).catch((err)=>{
                    console.log(err);
                    //catch errors inserting the new member's details in our db
                    return err;
                });
            }
        });
    });
};

const notifyAdmins = async function (firstName, lastName, sum) {
    const today = new Date();
    const recipients = await settingsManager.getSettingByName("newMemberAlertRecipients");
    const htmlBody = `
    <div dir="rtl" style="text-align: right;">
        <h3 style="color: #60076e">
            ${firstName} ${lastName} נרשמה לתנועה 
        </h3>
        <p>ההרשמה התבצעה בתאריך ${today.getUTCFullYear() + "-" + (today.getUTCMonth() + 1) + "-" + today.getUTCDate()}</p>
        <p>דמי החבר החודשיים: ${sum}₪</p>
    </div>
    `;
    const textBody = `${firstName} ${lastName} נרשמה לתנועה 
      ההרשמה התבצעה בתאריך ${today.getUTCFullYear() + "-" + (today.getUTCMonth() + 1) + "-" + today.getUTCDate()}
      דמי החבר החודשיים: ${sum}₪
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
    const htmlBody = `<html><head>
    <link href="https://fonts.googleapis.com/css?family=Cabin" rel="stylesheet" type="text/css">
			<link href="https://fonts.googleapis.com/css?family=Cairo" rel="stylesheet" type="text/css">
			<link href="https://fonts.googleapis.com/css?family=Rubik" rel="stylesheet" type="text/css">
			<link href="https://fonts.googleapis.com/css?family=Assistant" rel="stylesheet" type="text/css">
			<link href="{favicon}" rel="icon" type="image/x-icon">
			<link href="https://fonts.googleapis.com/css?family=Alef:400,700&amp;subset=hebrew" rel="stylesheet" type="text/css">
<style>
    @import url('https://fonts.googleapis.com/css?family=Mirza:400,500,600,700&display=swap&subset=arabic');
    body {
  margin: 0;
    font-family: Alef, Mirza, Rubik, Cabin, sans-serif;
}
</style>
</head><body dir="rtl"><div style="
    border:  5px solid purple;
    padding: 3em;
    margin:  5em auto;
    width: 70%;
">
    <p align="center">
    <img width="147" height="75" src="https://static.wixstatic.com/media/7ff315_69d5a4e4e5c44ae9a3fb526ee0095976~mv2.png/v1/fit/w_700,h_75,al_c,q_100/image.png" alt="https://static.wixstatic.com/media/7ff315_69d5a4e4e5c44ae9a3fb526ee0095976~mv2.png/v1/fit/w_700,h_75,al_c,q_100/image.png">
</p>
<p align="center" dir="RTL">
    <strong>היי </strong>
    <strong>مرحبًا!</strong>
    <strong></strong>
</p>
<p align="center" dir="RTL">
    <strong>
        ברוכים הבאים לתנועת עומדים ביחד! שמחים שהצטרפת! רצינו, בכמה מילים, לספר
        לכם על התנועה שלנו – ושלך
    </strong>
    <strong>
        أهلًا وسهلًا بك في حراك نقف معًا! سعداء لانضمامك! نودّ أن نروي لك
        باختصار عن حراكنا - وحراكك
    </strong>
</p>
<p dir="RTL">
    <strong>"עומדים ביחד" </strong>
    היא תנועה פוליטית של מאבק ושל תקווה, בעלת ערכים סוציאליסטיים, ששותפים בה
    חברים וחברות מכל קצוות הארץ. אנחנו נאבקים למען שלום, עצמאות וצדק לשני
    העמים; למען שוויון מלא לכל מי שחיים בארץ הזו; למען צדק חברתי אמיתי. אנחנו
    תנועה דמוקרטית, שבה החברות והחברים הן שיוזמים את הפעילות, מובילים אותה, וגם
    יכולים לבחור ולהיבחר להנהגת התנועה.
</p>
<p dir="RTL">
    <strong>"</strong>
    <strong>نقف معًا"</strong>
    هو حراك سياسي يسعى للنضال والأمل، يحمل قيمًا اشتراكية، ويتألف من أعضاء
    وعضوات من كل بقاع البلاد. نحن نناضل من أجل السلام، الاستقلالية والعدالة
    للشعبين؛ من أجل المساواة التامة لكل من يعيش في هذه البلاد؛ من أجل عدالة
    اجتماعية حقيقية. حراكنا ديمقراطي، يبادر لنشاطاته ويقودها العضوات والأعضاء،
    وبإمكانهم أيضًا الترشح والترشيح لقيادة الحراك.
</p>
<p align="center" dir="RTL">
    <strong>אז מה אפשר לעשות עכשיו?</strong>
    <br>
    <strong>إذًا، ما الذي يمكنك فعله الآن؟</strong>
</p>
<p dir="RTL">
    1.<strong> להצטרף למעגל המקומי באזור מגוריך. </strong>עומדים ביחד פרושה
    כיום בתשעה מעגלי פעילות ברחבי הארץ, ושם מתחילה הפעילות שלנו. אם כבר קיים
    מעגל מקומי באזור שלך, אז ממש בקרוב יפנו אליך ויצרפו אותך לקבוצת הפעילות של
    המעגל. לא חייבים לקחת חלק בפעילות ובמעגל – אבל אנחנו בהחלט מעודדים את
    החברות והחברים שלנו להיות פעילים בתנועה. אם עוד אין מעגל באזור שלך, אז זה
    כמובן הזמן להתחיל ולבנות אותו, בליווי צוות האורגנייזינג של התנועה.
    <br>
    ١. <strong>ألانضمام للحلقة المحلية بمنطقة سكنك.</strong> لنقف معًا اليوم
    تسع حلقات ناشطة في أنحاء البلاد، ومنها تبدأ نشاطاتنا. إن كانت هناك حلقة
    محلية في منطقة سكنك، فبالوقت القريب سيتمّ التواصل معك لضمّك لمجموعة العمل
    في الحلقة. لست مجبرًا على الانضمام للعمل وللحلقة - ولكننا حتمًا نشجع رفاقنا
    ورفيقاتنا على أن يكونوا ناشطين في الحراك. بحال عدم تواجد حلقة في منطقة
    سكنك، إذًا فهذا هو بالطبع الوقت الملائم للمباشرة ببنائها، وذلك بمرافقة طاقم
    التنظيم الحراكي.
</p>
<p dir="RTL">
    2. <strong>לומד/ת במכללה או באוניברסיטה?</strong> אפשר
    <a href="https://forms.gle/aDySPDtR9ue8nk8V8" target="_blank">
        להירשם כאן
    </a>
    וניצור קשר בהקדם, כדי לדבר איתך על הפעילות שלנו בקמפוסים.
    <br>
    ٢. <strong>تتعلم/ين في كلية أو جامعة؟</strong> يمكنك
    <u>
        <a href="https://forms.gle/aDySPDtR9ue8nk8V8" target="_blank">
            التسجيل هنا
        </a>
    </u>
    وسنتصل بك قريبًا، كي نتحدث معك عن أنشطتنا داخل مؤسسات التعليم العالي.
</p>
<p dir="RTL">
    3. <strong>רוצה לארח חוג בית?</strong> מעולה. כתבו לנו בחזרה ונתחיל ללכת על
    זה.
    <br>
    ٣. <strong>ترغب/ين باستضافة لقاء بيتي؟</strong> ممتاز. أكتبوا لنا ردًا على
    هذه الرسالة وسنخطط لذلك سويةً.
</p>
<p dir="RTL">
    4. <strong>למדו עוד על התנועה:</strong>
    <br>
    * ככה אנחנו פועלים בחברה הישראלית:
    <a href="https://www.standing-together.org/theoryofchange?utm_campaign=b01844cf-19fe-452c-9950-17b6314c66ab&amp;utm_source=so&amp;utm_medium=mail_lp&amp;cid=00000000-0000-0000-0000-000000000000" target="_blank">
        קראו את מסמך תיאוריית השינוי של התנועה
    </a>
    , שגובש בתהליך משותף ודמוקרטי בידי חברות וחברי התנועה מכל הארץ.
    <br>
    * ככה אנחנו מאורגנים:
    <a href="https://www.standing-together.org/structure?utm_campaign=b01844cf-19fe-452c-9950-17b6314c66ab&amp;utm_source=so&amp;utm_medium=mail_lp&amp;cid=00000000-0000-0000-0000-000000000000" target="_blank">
        קראו את הכללים הארגוניים של התנועה
    </a>
    , כדי לדעת מה המבנה שלה ואיך אפשר להשפיע.
    <br>
    ٤. <strong>إعرفوا المزيد عن الحراك:</strong>
    <br>
    * نعمل داخل المجتمع الإسرائيلي على النحو التالي:
    <a href="https://www.standing-together.org/theoryofchange?utm_campaign=b01844cf-19fe-452c-9950-17b6314c66ab&amp;utm_source=so&amp;utm_medium=mail_lp&amp;cid=00000000-0000-0000-0000-000000000000" target="_blank">
        إقرأوا وثيقة نظرية التغيير التي وضعها
    </a>
    الحراك بعد عمل مشترك وديمقراطي قام به عضوات وأعضاء الحراك من أنحاء البلاد.
    <br>
    * نحن منظمون بهذا الشكل:
    <a href="https://www.standing-together.org/structure?utm_campaign=b01844cf-19fe-452c-9950-17b6314c66ab&amp;utm_source=so&amp;utm_medium=mail_lp&amp;cid=00000000-0000-0000-0000-000000000000" target="_blank">
        إقرأوا القواعد التنظيمية للحراك
    </a>
    ، للتعرف على مبناه وكيفية التأثير داخله.
</p>
<p align="center">
    <strong>מחכים לראות אתכן ואתכם בשטח, במאבקים ובפגישות השוטפות</strong>
    <strong>,</strong>
    <strong>
        ننتظر لقاءكم ولقاءكن في الميدان، بالنضالات وبالاجتماعات الدورية،
    </strong>
</p>
<p align="center">
    <strong>המזכירות של תנועת עומדים ביחד</strong>
    <strong> </strong>
    <strong>سكرتارية حراك نقف معًا</strong>
</p>
<p align="center">
    <img border="0" width="624" height="290" src="https://static.wixstatic.com/media/b85840_73f95c658e8f4c90b581581d3d7cee49~mv2.jpg/v1/fit/w_700,h_2000,al_c,q_85/image.jpg" alt="https://static.wixstatic.com/media/b85840_73f95c658e8f4c90b581581d3d7cee49~mv2.jpg/v1/fit/w_700,h_2000,al_c,q_85/image.jpg">
</p></div></body></html>`;
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
    registerMember
};