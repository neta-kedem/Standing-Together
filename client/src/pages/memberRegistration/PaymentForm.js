import React from 'react';
import style from './PaymentForm.css'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowRight, faCheckCircle} from '@fortawesome/free-solid-svg-icons'
library.add(faArrowRight);

export default class PaymentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handleChange: props.handleChange,
            amounts: [5.9, 18, 27, 50, 78, 100, 150, 250],
            displayForm: false
        };
    }

    handleInputChange = function (event){
        this.state.handleChange(event.target.name, event.target.value);
    }.bind(this);

    handleContributionAmountSelection = function (amount){
        this.setState({displayForm: true});
        this.state.handleChange("selectedAmount", amount);

    }.bind(this);
    closeContributionForm = function (){
        this.setState({displayForm: false});
    }.bind(this);
    render() {
        const paymentData = this.props.paymentData;
        const displayForm = this.state.displayForm;
        const contributionAmounts = this.state.amounts.slice();
        const contributionButtons = <div className={"contribution-options"}>
            {contributionAmounts.map((sum)=>{
                return <button  type="button" className={"contribution-button"} key={"sum_" + sum} onClick={()=>{this.handleContributionAmountSelection(sum)}}>
                        <span className={"contribution-value"}>{sum}</span>
                        <span className={"contribution-units"}>₪ לחודש</span>
                    </button>;
            })}
        </div>;
        const contributionForm = <div className="contributionForm">
            <div>תשלום חברות חודשי של {paymentData.selectedAmount}₪ לחודש</div>
            <div onClick={this.closeContributionForm} className={"close-payment-form"}>
                <FontAwesomeIcon icon="arrow-right" className="close-payment-form-icon"/>
                <div className="close-payment-form-label">בחירת סכום אחר</div>
            </div>
            <label>
            <div className={"credit-card-field-title"}>אמצעי תשלום</div>
            <select name="CardTypeId" value={paymentData.CardTypeId} onChange={this.handleInputChange}
                    className={paymentData["CardTypeIdValid"] === false ? "invalid" : ""}>
                <option value="0">בחרו אמצעי תשלום</option>
                <option value="6">אמריקן אקספרס</option>
                <option value="1">ויזה</option>
                <option value="2">מאסטרקארד</option>
                <option value="3">ישראכרט</option>
            </select>
            </label>
            <label>
                <div className={"credit-card-field-title"}>מספר אשראי</div>
                <input type="text" name="CreditCardNo" size="18" value={paymentData.CreditCardNo} onChange={this.handleInputChange}
                       className={paymentData["CreditCardNoValid"] === false ? "invalid" : ""}/>
            </label>
            <div className={"credit-card-field-title"}>תוקף</div>
            <select name="year" value={paymentData.year} onChange={this.handleInputChange}
                    className={paymentData["yearValid"] === false ? "invalid" : ""}>
                <option value=""> </option>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
                    const year = new Date().getUTCFullYear() + i;
                    return <option value={year} key={"year_" + year}>{year}</option>;
                })}
            </select>
            <span>/</span>
            <select name="month" value={paymentData.month} onChange={this.handleInputChange}
                    className={paymentData["monthValid"] === false ? "invalid" : ""}>
                <option value=""> </option>
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
            <div className={"credit-card-field-title"}>שלוש ספרות אחרונות על גב הכרטיס</div>
            <input type="text" inputMode="numeric" name="CVV" maxLength="3" size="3" value={paymentData.CVV} onChange={this.handleInputChange}
                   className={paymentData["CVVValid"] === false ? "invalid" : ""}/>
            </label>
        </div>;
        return (
            <div className={"payment-form"}>
                <style jsx global>{style}</style>
                {displayForm?contributionForm:contributionButtons}
            </div>
        );
    }
}