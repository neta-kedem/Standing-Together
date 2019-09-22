import React from 'react'
import server from '../../services/server'
import whatsappLogoOverlay from '../../static/whatsapp_qr_overlay.svg'
import './bulkSender.scss'

export default class BulkSender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getContacts: this.props.getContacts,
            session: {
                initiated: null,
                qrUrl: null,
                profileImg: null,
                contactCount: null,
                processedContactCount: null,
            },
            sessionPingInterval: null
        }
    }

    initiateSession = function() {
        if(this.state.session.initiated)
            return;
        const session = this.state.session;
        session.initiated = true;
        this.setState({session});
        server.post('whatsapp/send', {
            messages: this.state.getContacts(),
        }).then(result => {
            if(this.state.sessionPingInterval)
                clearInterval(this.state.sessionPingInterval)
        });
        const sessionPingInterval = setInterval(this.pingSession, 1500);
        this.setState({sessionPingInterval});
    }.bind(this);

    pingSession = function(){
        server.get('whatsapp/progress').then(session => {
            this.setState({session});
        })
    }.bind(this);

    cleanProfileImageUrl = function(url){
        let cleaned = url.substring(url.indexOf("https%3A%2F%2F"), url.length);
        cleaned = decodeURIComponent(cleaned);
        return cleaned;
    };

    render() {
        const initiated = this.state.session.initiated;
        const qrUrl = this.state.session.qrUrl;
        const profileImg = this.state.session.profileImg;
        const contactCount = this.state.session.contactCount;
        const processedContactCount = this.state.session.processedContactCount;
        return (
            <div className={"bulk-sender-wrap"}>
                {
                    initiated ? (
                        <button type={"button"} onClick={this.initiateSession}>SEND WHATSAPP</button>
                    ) : null
                }
                {
                    (qrUrl && !profileImg) ? (
                        <div className={"whatsapp-qr-wrap"}>
                            <img alt={"qr"} className={"whatsapp-qr"} src={qrUrl}/>
                            <img alt={"qr-logo"} className={"whatsapp-logo-overlay"} src={whatsappLogoOverlay}/>
                        </div>
                    ) : null
                }
                {
                    (profileImg) ? (
                        <div className={"profile-image-wrap"}>
                            <div className={"profile-image-label"}>ההודעות נשלחות מ:</div>
                            <img alt={"profile"} className={"profile-image"} src={this.cleanProfileImageUrl(profileImg)}/>
                        </div>
                    ) : null
                }
                {
                    (true) ? (
                        <div className={"sending-progress-bar"}>
                            <div className={"sending-progress"}/>
                            <div className="sent-count">{processedContactCount + "/" + contactCount}</div>
                        </div>
                    ) : null
                }
            </div>
        )
    }
}