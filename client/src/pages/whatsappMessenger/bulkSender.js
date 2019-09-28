import React from 'react'
import server from '../../services/server'
import whatsappLogoOverlay from '../../static/whatsapp_qr_overlay.svg'
import './bulkSender.scss'
import LoadSpinner from "../../UIComponents/LoadSpinner/LoadSpinner";

export default class BulkSender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getContacts: this.props.getContacts,
            loadingSession: false,
            initiatedSession: false,
            session: {
                qrUrl: null,
                profileImg: null,
                contactCount: null,
                processedContactCount: null,
            },
            finishedSession: false,
            sessionPingInterval: null
        }
    }

    initiateSession = function() {
        if(this.state.initiatedSession)
            return;
        const session = this.state.session;
        this.setState({session, initiatedSession: true, loadingSession: true});
        server.post('whatsapp/send', {
            messages: this.state.getContacts(),
        }).then(result => {
            if(this.state.sessionPingInterval)
                clearInterval(this.state.sessionPingInterval);
            this.setState({sessionPingInterval, finishedSession: true, session: {}});
        });
        const sessionPingInterval = setInterval(this.pingSession, 1500);
    }.bind(this);

    pingSession = function(){
        server.get('whatsapp/progress').then(session => {
            if(session && session.qrUrl){
                this.setState({loadingSession: false});
            }
            if(!session && this.state.initiatedSession){
                this.setState({finishedSession: true, session: {}});
            }
            else{
                this.setState({session});
            }
        })
    }.bind(this);

    cleanProfileImageUrl = function(url){
        let cleaned = url.substring(url.indexOf("https%3A%2F%2F"), url.length);
        cleaned = decodeURIComponent(cleaned);
        return cleaned;
    };

    render() {
        const initiated = this.state.initiatedSession;
        const finished = this.state.finishedSession;
        const qrUrl = this.state.session.qrUrl;
        const profileImg = this.state.session.profileImg;
        const contactCount = this.state.session.contactCount;
        const processedContactCount = this.state.session.processedContactCount;
        return (
            <div className={"bulk-sender-wrap"}>
                <LoadSpinner visibility={initiated && !qrUrl && !profileImg && !finished} align={"center"}/>
                {
                    !initiated ? (
                        <button type={"button"} className={"initiate-session"} onClick={this.initiateSession}>SEND WHATSAPP</button>
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
                    (profileImg && contactCount) ? (
                        <div className={"sending-progress-bar"}>
                            <div className={"sending-progress"} style={{"width":((processedContactCount / contactCount) * 100) + "%"}}/>
                            <div className="sent-count">
                                {processedContactCount + "/" + contactCount}
                            </div>
                        </div>
                    ) : null
                }
                {
                    (finished) ? (
                        <div className={"done-message"}>
                            סיימנו!
                        </div>
                    ) : null
                }
            </div>
        )
    }
}