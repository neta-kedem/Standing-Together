import React from 'react'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';
import MessageEditor from './whatsappMessenger/messageEditor';
import ContactsTable from './whatsappMessenger/contactsTable';
import BulkSender from './whatsappMessenger/bulkSender';

export default class WhatsappMessenger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [
                {content: "", name: "version 1"}
            ],
            contacts: [
                {number: "", params: [], messageVersion: 0}
            ],
            hideEditor: false,
            selectedVersion: 0,
            params: ["FIRSTNAME", "LASTNAME"],
            attemptedPost: false
        }
    }
    componentDidMount() {
    }

    handleMessageChange = function(message){
        const messages = this.state.messages.slice();
        messages[this.state.selectedVersion].content = message;
        this.setState({messages});
    }.bind(this);

    selectVersion = function(selectedVersion){
        this.setState({selectedVersion});
    }.bind(this);

    addVersion = function(){
        const messages = this.state.messages.slice();
        messages.push({
            name: "version_" + (messages.length + 1),
            content: messages[this.state.selectedVersion].content
        });
        this.setState({messages});
    }.bind(this);

    handleContactsChange = function(contacts){
        this.setState({contacts});
    }.bind(this);

    handleParamsChange = function(params){
        this.setState({params});
    }.bind(this);

    validatePhoneNumber = function(phone){
        return /^([0-9]){12}$/.test(phone);
    }.bind(this);

    getMessageList = function(){
        this.setState({attemptedPost: true});
        const contacts = this.state.contacts.slice();
        const params = this.state.params.slice();
        const messages = this.state.messages;
        const messageList = [];
        let foundErrors = false;
        contacts.forEach((c) => {
            if(!this.validatePhoneNumber(c.number)){
                foundErrors = true;
            }
            let personalized = messages[c.messageVersion].content;
            for(let i = 0; i < params.length; i++){
                personalized = personalized.replace("$" + params[i], c.params[i]).replace("\n", "%0a");
                if(!c.params[i] || !c.params[i].length){
                    foundErrors = true;
                }
            }
            messageList.push({number: c.number, message: personalized})
        });
        if(foundErrors){
            return false;
        }
        this.setState({hideEditor: true});
        return messageList;
    }.bind(this);

    render() {
        const hideEditor = this.state.hideEditor;
        const params = this.state.params.slice();
        return (
            <div className={"page-wrap-whatsapp-sender"} dir="rtl">
                <TopNavBar>
                    <div className="title-wrap">
                        <span className="title-lang">ارسال رسائل واتساب</span>
                        <span className="title-lang">שליחת הודעות וואטסאפ</span>
                    </div>
                </TopNavBar>
                {
                    hideEditor ? null :
                        <MessageEditor
                            messages={this.state.messages}
                            selectVersion={this.selectVersion}
                            addVersion={this.addVersion}
                            selectedVersion={this.state.selectedVersion}
                            onChange={(value) => {this.handleMessageChange(value)}}
                            params={params}
                        />
                }
                {
                    hideEditor ? null :
                        <ContactsTable
                            contacts={this.state.contacts}
                            params={this.state.params}
                            messages={this.state.messages}
                            onContactsChange={this.handleContactsChange}
                            onParamsChange={this.handleParamsChange}
                            highlightErrors={this.state.attemptedPost}
                        />
                }
                <BulkSender
                    getContacts={this.getMessageList}
                    displayEditor={()=>{this.setState({hideEditor: false})}}
                />
            </div>
        )
    }
}