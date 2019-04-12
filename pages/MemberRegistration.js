import React from 'react';
import RegistrationForm from './memberRegistration/RegistrationForm'
import PaymentForm from './memberRegistration/PaymentForm'
import style from './memberRegistration/MemberRegistration.css'
import server from "../services/server";
import FieldValidation from "../services/FieldValidation";
import Meta from '../lib/meta';

export default class MemberRegistration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activistData: {},
            transactionId: null,
            termsAccepted: false,
            postAttempted: false,
            profileFields: [
                {
                    name: "firstName", type: "text", ar: "الاسم الشخصي", he: "שם פרטי", width: 49,
                    validation: /^.{2,}$/,
                    required: true
                },
                {
                    name: "lastName", type: "text", ar: "اسم العائلة", he: "שם משפחה", width: 49,
                    validation: /^.{2,}$/,
                    required: true
                },
                {
                    name: "email", type: "email", ar: "البريد الإلكتروني", he: "אימייל", width: 59,
                    validation: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    required: true
                },
                {
                    name: "phone", type: "tel", ar: "رقم الهاتف", he: "מספר טלפון", width: 39,
                    validation: /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,}$/,
                    required: true
                },
                {
                    name: "residency", type: "select", ar: "البلد", he: "עיר", width: 39,
                    validation: /^.{2,}$/,
                    required: true
                },
                {
                    name: "street", type: "text", ar: "البلد", he: "רחוב", width: 39,
                },
                {
                    name: "houseNum", type: "text", ar: "البلد", he: "מספר בית", width: 19,
                },
                {
                    name: "apartmentNum", type: "text", ar: "البلد", he: "מספר דירה", width: 19,
                },
                {
                    name: "mailbox", type: "text", ar: "البلد", he: "תא דואר (אם אין שם רחוב)", width: 39,
                },
                {
                    name: "tz", type: "text", ar: "البلد", he: "מספר ת.ז.", width: 39,
                },
                {
                    name: "birthday", type: "text", ar: "البلد", he: "תאריך לידה", width: 40,
                    required: true
                },
            ],
        };
    }
    componentDidMount() {
    }
    handleTypedInput = function (name, value){
        let activist = this.state.activistData;
        activist[name] = value;
        activist[name + "Valid"] = FieldValidation.validate(value, name);
        this.setState({activistData: activist});
    }.bind(this);
    handlePayment = function (transactionId){
        this.setState({transactionId: transactionId});
    }.bind(this);
    handleTermsAcceptance = function (event){
        this.setState({termsAccepted: event.target.checked});
    }.bind(this);
    handlePost = function(){
        const activist = this.state.activistData;
        let activistWrap = [activist];
        if(!FieldValidation.validateAll(activistWrap, this.state.profileFields)){
            this.setState({postAttempted: true, activist: activistWrap[0]});
            return;
        }
        console.log(activist);
    }.bind(this);
    render() {
        return (
            <div dir={"rtl"}>
                <Meta/>
                <style jsx global>{style}</style>
                <img src="../static/Logo.svg" alt="standing-together" className='logo'/>
                <div className={"form-container"}>
                    <div className={"registration-form-title"}>
                        <div>إنضمّوا لحراك نقف معًا</div>
                        <div>הצטרפו לתנועת עומדים ביחד</div>
                    </div>
                    <span className={"section-instruction"}>1. אנא מלאו את הפרטים האישיים שלכם يرجى تعبئة تفاصيلكم/ن الشخصية:</span>
                    <br/>
                    <span>הצטרפו ל<b>עומדים ביחד</b> והפכו לחלק מתנועת השטח הגדולה בישראל. תנועה המובילה את המאבק לשלום, לשוויון ולצדק חברתי.</span>
                    <span>إنضمّوا ل<b>نقف معًا</b> وكونوا جزءًا من الحراك الميداني الأكبر في إسرائيل. حراك يقود النضال من أجل السلام، المساواة والعدالة الاجتماعية.</span>
                    <RegistrationForm
                        activistData={this.state.activistData}
                        profileFields={this.state.profileFields}
                        handleChange={this.handleTypedInput.bind(this)}
                        highlightInvalidFields={this.state.postAttempted}
                    />
                    <span className={"section-instruction"}> 2. אנא לחצו על סכום דמי החבר אותו תרצו לשלם והכניסו בטופס שיפתח את פרטי האשראי שלכן/ם يرجى الضعط على مبلغ رسوم عضويتكم، وإدخال تفاصيل بطاقة اعتمادكم في الاستمارة التي ستظهر:</span>
                    <br/>
                    <PaymentForm handlePayment={this.handlePayment}/>
                    <span className={"section-instruction"}>3. אנא קראו והסכימו לתנאי ההצטרפות يرجى قراءة شروط الانضمام والمصادقة عليها:</span>
                    <br/>
                    <div><b>
                        אני, החתומ/ה מטה, מבקש/ת להצטרף להיות חבר/ה בתנועת "עומדים ביחד" ולפעול במסגרתה ً انا الموقع\ة ادناه, اطلب االنضمام الى حراك »نقف معا« وان اعمل من خالله:
                    </b></div>
                    <span>אני רוצה להצטרף לתנועת "עומדים ביחד" כי אני מקבל/ת את עקרונותיה הרעיוניים, הפוליטיים והארגוניים, של התנועה, שהיא תנועה פוליטית של מאבק ושל תקווה, בעלת ערכים סוציאליסטיים. אני מבינ/ה שבתנועה שותפים חברים וחברות מכל קצוות הארץ - צעירים ומבוגרים, יהודים וערבים, נשים וגברים, מהמרכז ומהפריפריה - ואני מוכנ/ה לפעול במשותף מתוך אמונה שרק ביחד נוכל לשנות את המקום בו אנחנו חיים. אני מצהיר/ה שאפעל ביחד עם חברותיי וחבריי בתנועה כדי לחתור לשוויון מלא לכל מי שחיים כאן; לצדק חברתי אמיתי; לשלום, לעצמאות ולצדק לשני העמים. אפעל במסגרת התנועה כדי לשנות את השיטה החברתית והפוליטית הקיימת, שלא פועלת לטובת הרוב בחברה, אלא לטובת מיעוט קטן שנהנה מהמצב הקיים. אני מתחייב/ת להיות חלק מהמאבק להעמדת חלופה כוללת לימין, לשינוי מהותי בחברה הישראלית, ולהפיכת הארץ הזו למקום לכולנו.

    أريد الانضمام لحراك "نقف معًا" لأني أقبل بالمبادئ الفكريّة, السّياسيّة, والتنظيمية للحراك, والذي هو حراك سياسي يعنى بالنّضال والأمل, كما ويحمل مبادئ وقيم اشتراكيّة. إني أعي أنّ الحراك يضم شركاء وشريكات من كل انحاء البلاد - شبابًا وشيبًا, يهودًا وعربًا, نساءً ورجالًا, من المركز ومن الأرياف - وأنا مستعد\ة للعمل المشترك من منطلق إيماني بأننا وفقط عندما نكون معًا يمكننا تغيير المكان الذي نعيش به. أصرّح بهذا انّي سأعمل سويةً مع رفاقي ورفيقاتي في الحراك من أجل السعي لتحقيق المساواة الكاملة لكلّ من يعيش هنا؛ من أجل العدالة الاجتماعيّة الحقيقيّة؛ من أجل السّلام, ألاستقلال والعدالة لكلا الشعبين. سأعمل من خلال الحراك من أجل تغيير السّياسات الاجتماعيّة والسّياسيّة السّائدة اليوم, والتي لا تخدم مصالح الأغلبية في المجتمع, بل تصب في مصلحة أقليّة صغيرة هي المستفيدة من الوضع القائم. أتعهد أن أكون جزءًا من النضال من أجل وضع بديل شامل لليمين, من أجل إحداث تغيير جذري في المجتمع الإسرائيلي, وتحويل هذه البلاد لمكانٍ لنا جميعًا.</span>
                    <div>
                        <label>
                            <input type={"checkbox"} onChange={this.handleTermsAcceptance}/>
                            <span>אני מאשר/ת שקראתי והסכמתי</span>
                            </label>
                    </div>
                    <button
                        className={"register-button"}
                        disabled={!this.state.transactionId || !this.state.termsAccepted}
                        onClick={this.handlePost}>
                        אני רוצה להצטרף!
                    </button>
                </div>
            </div>
        );
    }
}