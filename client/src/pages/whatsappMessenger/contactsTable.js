import React from 'react'
import "./contactsTable.scss";
import Alert from "../../UIComponents/Alert/Alert"
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
library.add(faPlus, faTimes, faEye);

export default class ContactsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateContacts: this.props.onContactsChange,
            updateParams: this.props.onParamsChange,
            alertQueue: []
        }
    }
    componentDidMount() {
    }

    phoneRegex = /\+972([0-9]){9}$/;

    handleContactPhoneChange = function(contactIndex, value){
        const contacts = this.props.contacts.slice();
        contacts[contactIndex].number = value;
        this.state.updateContacts(contacts);
    }.bind(this);

    handleContactParamChange = function(contactIndex, paramIndex, value){
        const contacts = this.props.contacts.slice();
        contacts[contactIndex].params[paramIndex] = value;
        this.state.updateContacts(contacts);
    }.bind(this);

    handleParamChange = function(paramIndex, value){
        const params = this.props.params.slice();
        params[paramIndex] = value.toUpperCase();
        this.state.updateParams(params);
    }.bind(this);

    addContact = function(){
        const contacts = this.props.contacts.slice();
        contacts.push({params: []});
        this.state.updateContacts(contacts);
    }.bind(this);

    deleteContact = function(index){
        const contacts = this.props.contacts.slice();
        contacts.splice(index, 1);
        this.state.updateContacts(contacts);
    };

    previewMessage = function(contact){
        let message = this.props.message;
        const params = this.props.params.slice();
        for(let i = 0; i < params.length; i++){
            message = message.replace("$" + params[i], contact.params[i])
        }
        const alertQueue = this.state.alertQueue.slice();
        alertQueue.push({content: message});
        this.setState({alertQueue});
    };

    handlePaste = function(event){
        const params = this.props.params.slice();
        const data = event.clipboardData.getData('text/plain').split("\n").map(row => row.split("\t"));
        //handle empty paste
        if(!data || !data.length || !data[0] || !data[0].length){
            return;
        }
        //handle single value paste
        if(data.length === 1 && data[0].length === 1){
            return;
        }
        //remove header row
        if(!/.*([0-9])+.*/g.test(data[0][0])){
            data.splice(0, 1);
        }
        //remove empty last row
        if(!data[data.length - 1] || !data[data.length - 1].length || !data[data.length - 1][0]){
            data.splice(data.length - 1, 1);
        }
        let newContacts = [];
        for(let i = 0; i < data.length; i++){
            let row = data[i];
            let contact = {};
            let phone = row[0];
            if(!phone){
                continue;
            }
            //format phone
            phone = phone.replace("-", "");
            if(phone[0] === "0"){
                phone = "+972" + phone.substring(1, phone.length);
            }
            contact.number = phone;
            contact.params = [];
            //parse params
            for(let j = 0; j < row.length - 1; j++){
                if(j >= params.length){
                    params.push("PARAM_" + (j + 1));
                }
                contact.params[j] = row[j+1]
            }
            newContacts.push(contact);
        }
        const existingContacts = this.props.contacts.slice();
        existingContacts.splice(existingContacts.length-1, 1);
        const contacts = existingContacts.concat(newContacts);
        this.state.updateContacts(contacts);
        this.state.updateParams(params);
        event.preventDefault();
        return false;
    };

    addParam = function(){
        const params = this.props.params.slice();
        params.push("");
        this.state.updateParams(params);
    }.bind(this);

    removeParam = function(paramIndex){
        const params = this.props.params.slice();
        params.splice(paramIndex, 1);
        const contacts = this.props.contacts.slice();
        contacts.forEach(c => {
           c.params.splice(paramIndex, 1);
        });
        this.state.updateParams(params);
        this.state.updateContacts(contacts);
    }.bind(this);

    render() {
        const contacts = this.props.contacts.slice();
        const params = this.props.params.slice();
        return (
            <div className={"whatsapp-contacts-wrap"} dir="rtl">
                <table className={"whatsapp-contacts-table"}>
                    <thead>
                    <tr>
                        <td>הודעה</td>
                        <td>טל'</td>
                        {params.map((p, i) => {
                            return <td className={"contact-param-cell"} key={"param_" + i} dir={"ltr"}>
                                <div className={"contact-param-wrap"}>
                                    $
                                    <input className={"contact-param-input"} type={"text"} value={p} onChange={(e) => {this.handleParamChange(i, e.target.value)}}/>
                                    <button type={"button"} onClick={()=>{this.removeParam(i)}}>
                                        <FontAwesomeIcon icon={"times"}/>
                                    </button>
                                </div>
                            </td>
                        })}
                        <td className={"add-param-cell"}>
                            <button type="button" onClick={this.addParam}>
                                <FontAwesomeIcon icon={"plus"}/>
                            </button>
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        contacts.map((c, i) => {
                            return (
                                <tr key = {"contact_" + i}>
                                    <td>
                                        <button
                                            type={"button"}
                                            className={"preview-message"}
                                            onClick={()=>{this.previewMessage(c)}}
                                        >
                                            <FontAwesomeIcon icon={"eye"}/>
                                        </button>
                                    </td>
                                    <td className={this.phoneRegex.test(c.number) || !c.number || !c.number.length ? "" : "invalid-contact-phone"}>
                                        <input
                                            className={"contact-info-input phone-input"}
                                            value={c.number || ""}
                                            onChange={(e) => {this.handleContactPhoneChange(i, e.target.value)}}
                                            onPaste={(e) => {if(i === contacts.length - 1){this.handlePaste(e)}}}
                                            dir={"ltr"}
                                            placeholder={"+972..."}
                                        />
                                    </td>
                                    {params.map((p, j) => {
                                        return <td key={"contact_" + i + "_" + j}>{
                                            <input
                                                value={c.params[j] || ""}
                                                className={"contact-info-input"}
                                                onChange={(e) => {this.handleContactParamChange(i, j, e.target.value)}}/>
                                        }</td>
                                    })}
                                    <td className={"delete-contact-cell"}>
                                        <button type="button" onClick={i => this.deleteContact(i)}>
                                            <FontAwesomeIcon icon={"times"}/>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
                <button type={"button"} onClick={this.addContact}>
                    <FontAwesomeIcon icon={"plus"}/>
                </button>
                <Alert queue={this.state.alertQueue} setQueue={(alertQueue)=>this.setState({alertQueue})} />
            </div>
        )
    }
}