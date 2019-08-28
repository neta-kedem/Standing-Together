import React from 'react'
import server from '../../services/server'
import whatsappLogoOverlay from '../../static/whatsapp_qr_overlay.svg'
import './bulkSender.scss'

export default class WhatsappMessenger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getContacts: this.props.getContacts,
            session: {
                profileImg: "https://web.whatsapp.com/pp?e=https%3A%2F%2Fpps.whatsapp.net%2Fv%2Ft61.24694-24%2F55816479_372583536678251_3253873730325053440_n.jpg%3Foe%3D5D659E52%26oh%3D74366511136940451b2ab381818c7ee5&t=s&u=972527306600%40c.us&i=1487087430"
            },
            sessionPingInterval: null
        }
    }

    initiateSession = function() {
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
        const qrUrl = this.state.session.qrUrl;
        const profileImg = this.state.session.profileImg;
        const contactCount = this.state.session.contactCount;
        const processedContactCount = this.state.session.processedContactCount;
        return (
            <div className={"bulk-sender-wrap"}>
                <button type={"button"} onClick={this.initiateSession}>SEND WHATSAPP</button>
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