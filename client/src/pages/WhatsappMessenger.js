import React from 'react'
import server from '../services/server'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';
import MessageEditor from './whatsappMessenger/messageEditor';
import ContactsTable from './whatsappMessenger/contactsTable';

export default class WhatsappMessenger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            contacts: [
                {number: "", params: []}
            ],
            params: ["FIRSTNAME", "LASTNAME"],
            qrSrc: null
        }
    }
    componentDidMount() {
    }

    handleMessageChange = function(message){
      this.setState({message});
    }.bind(this);

    handleContactsChange = function(contacts){
        this.setState({contacts});
    }.bind(this);

    handleParamsChange = function(params){
        this.setState({params});
    }.bind(this);

    sendWhatsapp = function() {
        server.post('whatsapp/send', {}).then(res => {
            this.setState({qrSrc: res.qrSrc});
        })
    }.bind(this);

    render() {
        const params = this.state.params.slice();
        return (
            <div className={"page-wrap-circle-management"} dir="rtl">
                <TopNavBar>
                    <div className="title-wrap">
                        <span className="title-lang">שליחת הודעות וואטסאפ</span>
                        <span className="title-lang">שליחת הודעות וואטסאפ</span>
                    </div>
                </TopNavBar>
                <MessageEditor value={this.state.message} onChange={(value) => {this.handleMessageChange(value)}} params={params}/>
                <ContactsTable
                    contacts={this.state.contacts}
                    params={this.state.params}
                    onContactsChange={this.handleContactsChange}
                    onParamsChange={this.handleParamsChange}
                />
                <button type={"button"} onClick={this.sendWhatsapp}>SEND WHATSAPP</button>
                <img src={this.state.qrSrc}/>
            </div>
        )
    }
}