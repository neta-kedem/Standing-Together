import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import {faArrowRight} from '@fortawesome/free-solid-svg-icons'
import "./PaymentForm.scss"
library.add(faArrowRight);

export default class PaymentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handleChange: props.handleChange,
        };
    }

    handleInputChange = function (event){
        this.state.handleChange(event.target.name, event.target.value);
    }.bind(this);

    closeContributionForm = function (){
        this.setState({displayForm: false});
    }.bind(this);

    render() {
        const paymentData = this.props.paymentData;
        const contributionForm = <div className="contributionForm">
            <label>
            <div className={"credit-card-field-title"}>
                <div>اختاروا وسيلة الدفع</div>
                <div>אמצעי תשלום</div>
            </div>
            <select name="CardTypeId" value={paymentData.CardTypeId} onChange={this.handleInputChange}
                    className={"input-field " + (paymentData["CardTypeIdValid"] === false ? "invalid" : "")}>
                <option value="0">اختاروا وسيلة الدفع בחר/י אמצעי תשלום</option>
                <option value="1">فيزا ויזה</option>
                <option value="2">ماستركارد מאסטרקארד</option>
                <option value="4">أمريكان إكسبرس אמריקן אקספרס</option>
                <option value="3">Discover</option>
            </select>
            </label>
            <label>
                <div className={"input-field credit-card-field-title"}>
                    <div>رقم البطاقة الائتمانية</div>
                    <div>מספר אשראי</div>
                </div>
                <input type="text" name="CreditCardNo" size="18" value={paymentData.CreditCardNo} onChange={this.handleInputChange}
                       className={paymentData["CreditCardNoValid"] === false ? "invalid" : ""}/>
            </label>
            <div className={"credit-card-field-title"}>
                <div>الصلاحية</div>
                <div>תוקף</div>
            </div>
            <select name="year" value={paymentData.year} onChange={this.handleInputChange}
                    className={paymentData["yearValid"] === false ? "invalid" : ""}>
                <option value=""/>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
                    const year = new Date().getUTCFullYear() + i;
                    return <option value={year} key={"year_" + year}>{year}</option>;
                })}
            </select>
            <span>/</span>
            <select name="month" value={paymentData.month} onChange={this.handleInputChange}
                    className={paymentData["monthValid"] === false ? "invalid" : ""}>
                <option value=""/>
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
            </select>
            <label>
                <div className={"credit-card-field-title"}>
                    <div>آخر ثلاث منازل بظهر البطاقة</div>
                    <div>שלוש ספרות אחרונות על גב הכרטיס</div>
                </div>
            <input type="text" inputMode="numeric" name="CVV" maxLength="3" size="3" value={paymentData.CVV} onChange={this.handleInputChange}
                   className={paymentData["CVVValid"] === false ? "invalid" : ""}/>
            </label>
        </div>;
        return (
            <div className={"payment-form"}>
                {contributionForm}
            </div>
        );
    }
}