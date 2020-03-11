import React from 'react';
import RegistrationForm from './crowdFunding/ContactForm'
import PaymentForm from './crowdFunding/PaymentForm'
import './crowdFunding/CrowdFunding.scss'
import server from "../services/server";
import FieldValidation from "../services/FieldValidation";
import IsraelGivesDonator from "../services/IsraelGivesCrowdFundingDonator";
import Popup from '../UIComponents/Popup/Popup';
import LoadSpinner from "../UIComponents/LoadSpinner/LoadSpinner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class CrowdFunding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sumSoFar: 0,
            target: 100000,
            base: 24000,
            amounts: [50, 100, 150, 250, 500, 1000, 1500, 2500],
            displayForm: false,
            activistData: {
                email: "",
                firstName: "",
                lastName: "",
                residency: "",
                address: ""
            },
            paymentInfo: {
                CVV: "",
                CardTypeId: 0,
                CreditCardNo: "",
                selectedAmount: null,
                month: "",
                year: ""
            },
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
                    name: "residency", type: "select", ar: "البلد", he: "עיר", width: 37.5,
                    validation: /^.{2,}$/,
                    required: true
                },
                {
                    name: "address", type: "text", ar: "عنوان", he: "כתובת", width: 37.5,
                }
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
            registrationSuccessful: false,
            donationSuccessful: false,
        };
    }
    sumRefreshInterval = 2000;

    componentDidMount() {
        this.registrationFormRef = React.createRef();
        this.paymentFormRef = React.createRef();
        this.ProfileFieldValidation = new FieldValidation();
        this.ProfileFieldValidation.setFields(this.state.profileFields);
        this.PaymentFieldValidation = new FieldValidation();
        this.PaymentFieldValidation.setFields(this.state.paymentFields);
        this.initiateSumFetchInterval();
    }

    componentWillUnmount() {
        this.cancelSumFetchInterval();
    }
    initiateSumFetchInterval(){
        this.refreshSum();
        const sumFetchInterval = setInterval(this.refreshSum.bind(this), this.sumRefreshInterval);
        // store interval promise in the state so it can be cancelled later:
        this.setState({sumFetchInterval: sumFetchInterval});
    }
    cancelSumFetchInterval(){
        if(this.state.callPingInterval)
            clearInterval(this.state.callPingInterval);
    }
    refreshSum(){
        server.get('crowdFund/sum', {})
            .then(json => {
                this.setState({sumSoFar: json.sum});
            });
    }

    handleContributionAmountSelection = function (amount){
        window.parent.postMessage({amountSelected: true}, "*");
        this.setState({displayForm: true});
        let info = this.state.paymentInfo;
        info["selectedAmount"] = amount ? Math.max(amount, 0) : amount;
        this.setState({paymentInfo: info});
    }.bind(this);

    closeContributionForm = function (){
        this.setState({displayForm: false});
    }.bind(this);

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

    handlePost = function(){
        //validate profile details
        const activist = this.state.activistData;
        let activistWrap = [activist];
        if(!this.ProfileFieldValidation.validateAll(activistWrap)){
            this.setState({postAttempted: true, activistData: activistWrap[0]});
            window.scrollTo(0, this.registrationFormRef.current.offsetTop);
            window.parent.postMessage({error: true, scrollTo: "profile"}, "*");
            return;
        }
        //validate payment info
        const paymentInfo = this.state.paymentInfo;
        let paymentWrap = [paymentInfo];
        if(!this.PaymentFieldValidation.validateAll(paymentWrap)){
            this.setState({postAttempted: true, paymentInfo: paymentWrap[0]});
            window.scrollTo(0, this.paymentFormRef.current.offsetTop);
            window.parent.postMessage({error: true, scrollTo: "payment"}, "*");
            return;
        }
        this.setState({processingDonation: true}, ()=>{
            this.registerMember(activist, paymentInfo);
        });

    }.bind(this);

    registerMember = function(activist, paymentInfo){
        new Promise((resolve, reject) => {
            /*resolve(true);
            return;*/
            if(this.state.donationSuccessful){
                resolve(true);
                return;
            }
            paymentInfo.frequency = 1;
            IsraelGivesDonator.donate(activist, paymentInfo).then(()=>{
                resolve(true);
            })
        }).then(() => {
            const data ={
                "activistData": activist,
                "amount": paymentInfo.selectedAmount
            };
            server.post('crowdFund', data)
                .then((result) => {
                    if(result.err){
                        this.setState({processingDonation: false, donationSuccessful: result.donation});
                        this.handleDonationFailedPopupToggle();
                        window.scrollTo(0, this.registrationFormRef.current.offsetTop);
                        window.parent.postMessage({error: true, scrollTo: "top"}, "*");
                    }
                    else{
                        this.setState({processingDonation: false, registrationSuccessful: true});
                        window.parent.postMessage({registrationSuccessful: true}, "*");
                    }
                });
        });
    };

    handleDonationFailedPopupToggle = function(){
        this.setState({displayFailedDonationPopup: !this.state.displayFailedDonationPopup});
    }.bind(this);

    render() {
        const contributionAmounts = this.state.amounts.slice();
        const contributionButtons = <div className={"contribution-options"}>
            {contributionAmounts.map((sum)=>{
                return <button  type="button" className={"contribution-button"} key={"sum_" + sum} onClick={()=>{this.handleContributionAmountSelection(sum)}}>
                    <div className={"contribution-amount"}>
                        <span className={"contribution-value"}>{sum}</span>
                        <span className={"contribution-units shekels"}>₪</span>
                    </div>
                </button>;
            })}
            <button  type="button" className={"contribution-button"} key={"sum_other"} onClick={()=>{this.handleContributionAmountSelection(false)}}>
                <div className={"contribution-amount"}>
                    <span className={"contribution-value"}>סכום אחר</span>
                </div>
            </button>
        </div>;
        const DonationForm = <div className={"donation-form"}>
            <div className={"close-payment-form"}>
                <button type={"button"} onClick={this.closeContributionForm} className="close-payment-form-icon" id={"close-payment-form-icon"}>
                    <FontAwesomeIcon icon="arrow-right"/>
                </button>
                <label className="close-payment-form-label" htmlFor="close-payment-form-icon">اختيار مبلغ آخر • בחירת סכום אחר</label>
            </div>
            <div className={"donation-amount-input-wrap"}>
                <div className={"donation-amount-input-label"}>
                    <div>التبرع بمبلغ </div>
                    <div>תרומה של </div>
                </div>
                <div className={"donation-amount-input"}>
                    <input
                        type="number"
                        value={this.state.paymentInfo.selectedAmount}
                        autoFocus={!this.state.paymentInfo.selectedAmount}
                        onChange={(e)=>this.handleContributionAmountSelection(e.target.value)}
                    />
                    ₪
                </div>
            </div>
            <div ref={this.registrationFormRef}>
                <RegistrationForm
                    lang={this.state.lang}
                    activistData={this.state.activistData}
                    profileFields={this.state.profileFields}
                    handleChange={this.handleTypedProfileInput.bind(this)}
                />
            </div>
            <div ref={this.paymentFormRef}>
                <PaymentForm
                    handleChange={this.handleTypedPaymentInput}
                    paymentData={this.state.paymentInfo}
                />
            </div>
            <div className={"register-button-wrap"}>
                {!this.state.processingDonation?
                    <button type={"button"}
                            className={"register-button"}
                            onClick={this.handlePost}>
                        <div>موافقة وتبرع</div>
                        <div>אישור ותרומה</div>
                    </button>
                    :''
                }
                <LoadSpinner visibility={this.state.processingDonation}/>
            </div>
        </div>;
        const target = this.state.target;
        const base = this.state.base;
        const sumSoFar = this.state.sumSoFar;
        const statusBar = <div>
            <div className={"donation-sum-bar-wrap"}>
                <div className={"donation-sum-bar"} style={{width:(Math.min((base+sumSoFar)/target, 1)*100)+"%"}}/>
                <div className={"donation-percentage"}>{Math.floor((base+sumSoFar)/target*100)}%</div>
            </div>
            <div className={"donation-ratio-details"}>
                <span>עד כה גוייסו </span>
                <span>{Math.floor(sumSoFar+base)}</span>
                <span> ש"ח מתוך </span>
                <span>{target}</span>
            </div>
        </div>;
        return (
            <div dir={"rtl"} className={"page-wrap-crowd-funding"}>
                {/**<img src="../static/Logo.svg" alt="standing-together" className='logo'/>**/}
                <div className={"form-container " + (this.state.postAttempted ? "highlight-invalid-fields" : "")}>
                    {statusBar}
                    {this.state.displayForm?DonationForm:contributionButtons}
                </div>
                <Popup visibility={this.state.displayFailedDonationPopup} toggleVisibility={this.handleDonationFailedPopupToggle.bind(this)}>
                    <div className={"failed-donation-message"}>
                        <h2>أوه لا! אוי לא!</h2>
                        <p>مع الأسف حصل خلل أثناء تلقّي التبرع، ولم يتم استيعابه.</p>
                        <p>לצערינו התרחשה שגיאה במהלך עיבוד התרומה, והיא לא נקלטה כראוי</p>
                        <p>تأكدوا من إدخالكم التفاصيل الصحيحة، وحاولوا مجددًا.</p>
                        <p>אנא וודאו שפרטי התשלום הוזנו באופן מדוייק, ונסו שוב</p>
                        <p>بحال تكررت المشكلة، يرجى التوجه إلينا على عنوان: info@standing-together.com أو على تلفون رقم ٧٣٠٦٦٠٠-٠٥٢</p>
                        <p>אם הבעיה חוזרת על עצמה, בבקשה פנו אלינו בכתובת: info@standing-together.com או בטלפון 052-7306600</p>
                        <button type={"button"}
                            className={"close-failed-donation-button"}
                            onClick={this.handleDonationFailedPopupToggle.bind(this)}>
                            בסדר
                        </button>
                    </div>
                </Popup>
                <Popup visibility={this.state.registrationSuccessful} toggleVisibility={()=>{}}>
                    <h4>هلمّوا إلى الثورة :)</h4>
                    <h4>יאללה, מהפכה :)</h4>
                </Popup>
            </div>
        );
    }
}