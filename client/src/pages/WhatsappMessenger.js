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
                {number: "", params: []}
            ],
            selectedVersion: 0,
            params: ["FIRSTNAME", "LASTNAME"],
            qrSrc: null
        }
    }
    componentDidMount() {
    }

    handleMessageChange = function(message, index){
        const messages = this.state.messages.slice();
        messages[index].content = message;
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

    getMessageList = function(){
        const contacts = this.state.contacts.slice();
        const params = this.state.params.slice();
        const message = this.state.message;
        const messageList = [];
        contacts.forEach((c) => {
            let personalized = message;
            for(let i = 0; i < params.length; i++){
                personalized = personalized.replace("$" + params[i], c.params[i])
            }
            messageList.push({number: c.number, message: personalized})
        });
        return messageList;
    }.bind(this);

    render() {
        const params = this.state.params.slice();
        return (
            <div className={"page-wrap-whatsapp-sender"} dir="rtl">
                <TopNavBar>
                    <div className="title-wrap">
                        <span className="title-lang">שליחת הודעות וואטסאפ</span>
                        <span className="title-lang">שליחת הודעות וואטסאפ</span>
                    </div>
                </TopNavBar>
                <MessageEditor
                    messages={this.state.messages}
                    selectVersion={this.selectVersion}
                    addVersion={this.addVersion}
                    selectedVersion={this.state.selectedVersion}
                    onChange={(value) => {this.handleMessageChange(value)}}
                    params={params}/>
                <ContactsTable
                    contacts={this.state.contacts}
                    params={this.state.params}
                    message={this.state.message}
                    onContactsChange={this.handleContactsChange}
                    onParamsChange={this.handleParamsChange}
                />
                <BulkSender
                    getContacts={this.getMessageList}
                />
            </div>
        )
    }
}