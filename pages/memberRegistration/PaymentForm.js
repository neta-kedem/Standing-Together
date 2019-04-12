import React from 'react';
import style from './PaymentForm.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {faArrowRight, faCheckCircle} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faArrowRight);

export default class PaymentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handlePayment: props.handlePayment,
            amounts: [5.9, 18, 27, 50, 78, 100, 150, 250],
            selectedAmount: 0,
            transactionId: null,
            displayForm: false
        };
    }
    componentDidMount() {
        this.paymentIframe = React.createRef();
        window.onmessage = this.handlePaymentConfirmation;
    }
    handlePaymentConfirmation = function (event){
        if (event.data) {
            if (event.data && event.data.amount) {
                const iframe = this.paymentIframe;
                iframe.src = "https://secured.israeltoremet.org/iframe/omdim?step=2&currency=1&sum=" + event.data.amount + "&freq=2&successurl=https://wix.standing-together.org?tdonid={donid}"
            }
            if (event.data && event.data.donationSuccessful) {
                const urlParam = event.data.donationParams.split("?");
                const params = urlParam[1].split("&");
                for (let i = 0; i < params.length; i++) {
                    if (params[i].indexOf("tdonid") !== -1) {
                        let transaction_id = (params[i].split("="))[1];
                        this.state.handlePayment(transaction_id);
                        this.setState({transactionId: transaction_id});
                    }
                }
            }
        }
    }.bind(this);
    handleTypedInput = function (name, value){
        let activist = this.state.activistData;
        activist[name] = value;
        this.handleChange(activist);
        this.setState({activistData: activist});
    }.bind(this);
    handleContributionAmountSelection = function (amount){
        this.setState({displayForm: true, selectedAmount: amount});
    }.bind(this);
    closeContributionForm = function (){
        this.setState({displayForm: false});
    }.bind(this);
    render() {
        const displayForm = this.state.displayForm;
        const selectedAmount = this.state.selectedAmount;
        const contributionAmounts = this.state.amounts.slice();
        const contributionButtons = <div className={"contribution-options"}>
            {contributionAmounts.map((sum)=>{
                return <div className={"contribution-button"} key={"sum_" + sum} onClick={()=>{this.handleContributionAmountSelection(sum)}}>
                        {sum}
                        ₪ לחודש
                    </div>;
            })}
        </div>;
        const form_src = "https://secured.israeltoremet.org/iframe/omdim?step=2&currency=1&sum="+selectedAmount+"&freq=2";
        const contributionForm = <div>
            {!this.state.transactionId?
                <div onClick={this.closeContributionForm} className={"close-payment-form"}>
                    <FontAwesomeIcon icon="arrow-right" className="close-payment-form-icon"/>
                    <div className="close-payment-form-label">בחירת סכום אחר</div>
                </div>
                :""}
            <iframe
                className={"contribution-iframe"}
                ref = {this.paymentIframe}
                id = "israel-gives-frame"
                src = {form_src}
            />
        </div>;
        return (
            <div className={"payment-form"}>
                <style jsx global>{style}</style>
                {displayForm?contributionForm:contributionButtons}
            </div>
        );
    }
}