import React from 'react';
import RegistrationForm from './memberRegistration/RegistrationForm'
import PaymentForm from './memberRegistration/PaymentForm'
import './memberRegistration/MemberRegistration.scss'
import server from "../services/server";
import FieldValidation from "../services/FieldValidation";
import IsraelGivesDonator from "../services/IsraelGivesDonator";
import Checkbox from '../UIComponents/Checkbox/Checkbox';
import Popup from '../UIComponents/Popup/Popup';
import LoadSpinner from "../UIComponents/LoadSpinner/LoadSpinner";

export default class MemberRegistration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: "he",
            activistData: {
                apartmentNum: "",
                birthday: "",
                email: "",
                firstName: "",
                houseNum: "",
                lastName: "",
                mailbox: "",
                phone: "",
                residency: "",
                street: "",
                tz: ""
            },
            paymentInfo: {
                CVV: "",
                CardTypeId: "1",
                CreditCardNo: "",
                selectedAmount: null,
                month: "",
                year: ""
            },
            termsAccepted: false,
            postAttempted: false,
            profileFields: [
                {
                    name: "firstName", type: "text", ar: "الاسم الشخصي", he: "שם פרטי", width: 47.5,
                    validation: /^.{2,}$/,
                    required: true
                },
                {
                    name: "lastName", type: "text", ar: "اسم العائلة", he: "שם משפחה", width: 47.5,
                    validation: /^.{2,}$/,
                    required: true
                },
                {
                    name: "email", type: "email", ar: "البريد الإلكتروني", he: "אימייל", width: 57.5,
                    validation: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    required: true
                },
                {
                    name: "phone", type: "tel", ar: "رقم الهاتف", he: "מספר טלפון", width: 37.5,
                    validation: /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,}$/,
                    required: true
                },
                {
                    name: "residency", type: "select", ar: "البلد", he: "עיר", width: 37.5,
                    validation: /^.{2,}$/,
                    required: true
                },
                {
                    name: "street", type: "text", ar: "البلد", he: "רחוב", width: 37.5,
                },
                {
                    name: "houseNum", type: "text", ar: "البلد", he: "מספר בית", width: 17.5,
                },
                {
                    name: "apartmentNum", type: "text", ar: "البلد", he: "מספר דירה", width: 17.5,
                },
                {
                    name: "mailbox", type: "text", ar: "البلد", he: "תא דואר (אם אין שם רחוב)", width: 37.5,
                },
                {
                    name: "tz", type: "text", ar: "البلد", he: "מספר ת.ז.", width: 37.5,
                },
                {
                    name: "birthday", type: "text", ar: "البلد", he: "תאריך לידה", width: 40,
                    required: true
                },
            ],
            paymentFields: [
                {
                    name: "CVV", type: "text",
                    validation: /\d{3}/,
                    required: true
                },
                {
                    name: "month", type: "select",
                    validation: /.+$/,
                    required: true
                },
                {
                    name: "year", type: "select",
                    validation: /.+$/,
                    required: true
                },
                {
                    name: "CreditCardNo", type: "text",
                    validation: /.{10,}$/,
                    required: true
                },
                {
                    name: "CardTypeId", type: "text",
                    validation: /[^0]/,
                    required: true
                }
            ],
            processingDonation: false,
            displayFailedDonationPopup: false,
            donationSuccessful: false
        };
    }

    componentDidMount() {
        this.registrationFormRef = React.createRef();
        this.paymentFormRef = React.createRef();
        this.ProfileFieldValidation = new FieldValidation();
        this.ProfileFieldValidation.setFields(this.state.profileFields);
        this.PaymentFieldValidation = new FieldValidation();
        this.PaymentFieldValidation.setFields(this.state.paymentFields);
    }

    handleTypedProfileInput = function (name, value){
        let activist = this.state.activistData;
        activist[name] = value;
        activist[name + "Valid"] = this.ProfileFieldValidation.validate(value, name);
        this.setState({activistData: activist});
    }.bind(this);

    handleTypedPaymentInput = function (name, value){
        let info = this.state.paymentInfo;
        info[name] = value;
        info[name + "Valid"] = this.PaymentFieldValidation.validate(value, name);
        this.setState({paymentInfo: info});
    }.bind(this);

    handleTermsAcceptance = function(checked){
        this.setState({termsAccepted: checked});
    }.bind(this);

    handlePost = function(){
        //validate profile details
        const activist = this.state.activistData;
        let activistWrap = [activist];
        if(!this.ProfileFieldValidation.validateAll(activistWrap)){
            this.setState({postAttempted: true, activistData: activistWrap[0]});
            window.scrollTo(0, this.registrationFormRef.current.offsetTop);
            return;
        }
        //validate payment info
        const paymentInfo = this.state.paymentInfo;
        let paymentWrap = [paymentInfo];
        if(!this.PaymentFieldValidation.validateAll(paymentWrap)){
            this.setState({postAttempted: true, paymentInfo: paymentWrap[0]});
            window.scrollTo(0, this.paymentFormRef.current.offsetTop);
            return;
        }
        this.setState({processingDonation: true}, ()=>{
            this.registerMember(activist, paymentInfo);
        });

    }.bind(this);

    registerMember = function(activist, paymentInfo){
        IsraelGivesDonator.donate(activist, paymentInfo).then((result => {
            const data ={
                "activistData": activist
            };
            server.post('membership', data)
                .then((result) => {
                    if(result.err){
                        this.setState({processingDonation: false});
                        this.handleDonationFailedPopupToggle();
                    }
                    else{
                        debugger;
                        window.parent.postMessage({donationSuccessful: true}, "*");
                    }
                });
        }));
    };

    handleDonationFailedPopupToggle = function(){
        this.setState({displayFailedDonationPopup: !this.state.displayFailedDonationPopup});
    }.bind(this);

    render() {
        return (
            <div dir={"rtl"} className={"page-wrap-member-registration"}>
                {/**<img src="../static/Logo.svg" alt="standing-together" className='logo'/>**/}
                <div className={"form-container " + (this.state.postAttempted ? "highlight-invalid-fields" : "")}>
                    <span>הצטרפו ל<b>עומדים ביחד</b> והפכו לחלק מתנועת השטח הגדולה בישראל. תנועה המובילה את המאבק לשלום, לשוויון ולצדק חברתי.</span>
                    <br/>
                    <span>إنضمّوا ل<b>نقف معًا</b> وكونوا جزءًا من الحراك الميداني الأكبر في إسرائيل. حراك يقود النضال من أجل السلام، المساواة والعدالة الاجتماعية.</span>
                    <br/>
                    <span className={"section-instruction"}>1. אנא מלאו את הפרטים האישיים שלכם يرجى تعبئة تفاصيلكم/ن الشخصية:</span>
                    <br/>
                    <div ref={this.registrationFormRef}>
                        <RegistrationForm
                            lang={this.state.lang}
                            activistData={this.state.activistData}
                            profileFields={this.state.profileFields}
                            handleChange={this.handleTypedProfileInput.bind(this)}
                        />
                    </div>
                    <span className={"section-instruction"}> 2. אנא לחצו על סכום דמי החבר אותו תרצו לשלם והכניסו בטופס שיפתח את פרטי האשראי שלכן/ם يرجى الضعط على مبلغ رسوم عضويتكم، وإدخال تفاصيل بطاقة اعتمادكم في الاستمارة التي ستظهر:</span>
                    <br/>
                    <div ref={this.paymentFormRef}>
                        <PaymentForm
                            handleChange={this.handleTypedPaymentInput}
                            paymentData={this.state.paymentInfo}
                        />
                    </div>
                    <span className={"section-instruction"}>3. אנא קראו והסכימו לתנאי ההצטרפות يرجى قراءة شروط الانضمام والمصادقة عليها:</span>
                    <br/>
                    <div>
                        <b>
                            אני, החתומ/ה מטה, מבקש/ת להצטרף להיות חבר/ה בתנועת "עומדים ביחד" ולפעול במסגרתה ً انا الموقع\ة ادناه, اطلب االنضمام الى حراك »نقف معا« وان اعمل من خالله:
                        </b>
                    </div>
                    <div>
                        אני רוצה להצטרף לתנועת "עומדים ביחד" כי אני מקבל/ת את עקרונותיה הרעיוניים, הפוליטיים והארגוניים, של התנועה, שהיא תנועה פוליטית של מאבק ושל תקווה, בעלת ערכים סוציאליסטיים.
                        אני מבינ/ה שבתנועה שותפים חברים וחברות מכל קצוות הארץ - צעירים ומבוגרים, ערבים ויהודים, נשים וגברים, מהפריפריה ומהמרכז - ואני מוכנ/ה לפעול במשותף מתוך אמונה שרק ביחד נוכל לשנות את המקום בו אנחנו חיים.
                        אני מצהיר/ה שאפעל ביחד עם חברותיי וחבריי בתנועה כדי לחתור לשוויון מלא לכל מי שחיים כאן; לצדק חברתי אמיתי; לשלום, לעצמאות ולצדק לשני העמים.
                        אפעל במסגרת התנועה כדי לשנות את השיטה החברתית והפוליטית הקיימת, שלא פועלת לטובת הרוב בחברה, אלא לטובת מיעוט קטן שנהנה מהמצב הקיים.
                        אני מתחייב/ת להיות חלק מהמאבק להעמדת חלופה כוללת לימין, לשינוי מהותי בחברה הישראלית, ולהפיכת הארץ הזו למקום לכולנו.
                    </div>
                    <div>
                        أريد الانضمام لحراك "نقف معًا" لأني أقبل بالمبادئ الفكريّة, السّياسيّة, والتنظيمية للحراك, والذي هو حراك سياسي يعنى بالنّضال والأمل, كما ويحمل مبادئ وقيم اشتراكيّة.
                        إني أعي أنّ الحراك يضم شركاء وشريكات من كل انحاء البلاد - شبابًا وشيبًا, يهودًا وعربًا, نساءً ورجالًا, من المركز ومن الأرياف - وأنا مستعد\ة للعمل المشترك من منطلق إيماني بأننا وفقط عندما نكون معًا يمكننا تغيير المكان الذي نعيش به.
                        أصرّح بهذا انّي سأعمل سويةً مع رفاقي ورفيقاتي في الحراك من أجل السعي لتحقيق المساواة الكاملة لكلّ من يعيش هنا؛ من أجل العدالة الاجتماعيّة الحقيقيّة؛ من أجل السّلام, ألاستقلال والعدالة لكلا الشعبين.
                        سأعمل من خلال الحراك من أجل تغيير السّياسات الاجتماعيّة والسّياسيّة السّائدة اليوم, والتي لا تخدم مصالح الأغلبية في المجتمع, بل تصب في مصلحة أقليّة صغيرة هي المستفيدة من الوضع القائم.
                        أتعهد أن أكون جزءًا من النضال من أجل وضع بديل شامل لليمين, من أجل إحداث تغيير جذري في المجتمع الإسرائيلي, وتحويل هذه البلاد لمكانٍ لنا جميعًا.
                    </div>
                    <div>
                        <Checkbox onChange={this.handleTermsAcceptance} checked={this.state.termsAccepted} label={
                            <div>
                                <div>אני מאשר/ת שקראתי והסכמתי</div>
                                <div>אני מאשר/ת שקראתי והסכמתי</div>
                            </div>
                        }/>
                    </div>
                    <div className={"register-button-wrap"}>
                        {!this.state.processingDonation?
                            <button type={"button"}
                                className={"register-button"}
                                disabled={!this.state.termsAccepted}
                                onClick={this.handlePost}>
                                    <div>אני רוצה להצטרף!</div>
                                    <div>אני רוצה להצטרף!</div>
                            </button>
                            :''
                        }
                        <LoadSpinner visibility={this.state.processingDonation}/>
                    </div>
                </div>
                <Popup visibility={this.state.displayFailedDonationPopup} toggleVisibility={this.handleDonationFailedPopupToggle.bind(this)}>
                    <div className={"failed-donation-message"}>
                        <h1>אוי לא!</h1>
                        <p>לצערינו התרחשה שגיאה במהלך עיבוד התרומה, והיא לא נקלטה כראוי</p>
                        <p>אנא וודאו שפרטי התשלום הוזנו באופן מדוייק, ונסו שוב</p>
                        <p>אם הבעיה חוזרת על עצמה, בבקשה פנו אלינו בכתובת: info@standing-together.com או בטלפון 052-7306600</p>
                        <button type={"button"}
                            className={"close-failed-donation-button"}
                            onClick={this.handleDonationFailedPopupToggle.bind(this)}>
                            בסדר
                        </button>
                    </div>
                </Popup>
            </div>
        );
    }
}