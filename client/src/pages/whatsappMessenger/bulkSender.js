import React from 'react'
import server from '../../services/server'
import whatsappLogoOverlay from '../../static/whatsapp_qr_overlay.svg'
import './bulkSender.scss'
import LoadSpinner from "../../UIComponents/LoadSpinner/LoadSpinner";
import PubSub from "pubsub-js";
import events from "../../lib/events";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons'
library.add(faThumbsUp);

const MAX_CONTACTS_WITHOUT_WARNING = 50;
const PING_SESSION_INTERVAL = 1500;

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
            sessionPingInterval: null,
            messages: []
        }
    }

    validateMessages = function() {
        if(this.state.initiatedSession)
            return;
        const messages = this.state.getContacts();
        this.setState({messages});
        if(!messages){
            PubSub.publish(events.alert, {
                content: <div dir={"rtl"}>
                    <h3 style={{marginTop: 0}}>חלק ממספרי הטלפון או הפרמטרים חסרים</h3>
                    <p>וודאו שכל הטלפונים הם בפורמט 972123456789, ואין פרמטרים ריקים בשום רשומה</p>
                </div>,
                flush: false,
                opaque: false,
                onClose: () => {},
                resolutionOptions: [
                    {
                        label: <FontAwesomeIcon icon={"thumbs-up"}/>,
                        onClick: () => {PubSub.publish(events.clearAlert, {})},
                    }
                ]
            });
            return;
        }
        if(messages.length >= MAX_CONTACTS_WITHOUT_WARNING){
            PubSub.publish(events.alert, {
                content: <div dir={"rtl"}>
                    <h2 style={{marginTop: 0}}>ברשימת הנמענים יש יותר מ-{MAX_CONTACTS_WITHOUT_WARNING} רשומות</h2>
                    <p>שליחת הרבה הודעות וואטצאפ בבת אחת עלולה לגרור חסימה של חשבון הוואטצאפ שלך (לנצח).</p>
                    <p>במקרה של רשימות ארוכות, מומלץ לפצל את השליחה ליותר מחלק אחד, ולחכות כמה דקות בין שליחת החלקים, או לשלוח את ההודעות ממשתמשים שונים.</p>
                    <p>אם להערכתך רוב הנמענים שמרו אותך ברשימת אנשי הקשר שלהם, או לפחות מכירים אותך, לא תהיה בעיה.</p>
                    <p>אחרת, שווה לשקול לבקש מפעילים אחרים בתנועה לעזור בשליחת ההודעות, או לקנות SIM ייעודי.</p>
                </div>,
                flush: false,
                opaque: false,
                onClose: () => {},
                resolutionOptions: [
                    {
                        label: "בסדר, לא לשלוח בינתיים",
                        onClick: () => {PubSub.publish(events.clearAlert, {})},
                    },
                    {
                        label: "הבנתי, להמשיך בשליחה בכל מקרה",
                        onClick: () => {
                            this.initiateSession(messages);
                            PubSub.publish(events.clearAlert, {});
                        },
                    }
                ]
            });
            return;
        }
        this.initiateSession(messages);
    }.bind(this);

    initiateSession = function(messages) {
        if(this.state.initiatedSession)
            return;
        const session = this.state.session;
        this.setState({session, initiatedSession: true, loadingSession: true});
        server.post('whatsapp/send', {
            messages: messages,
        }).then(result => {
            if(this.state.sessionPingInterval)
                clearInterval(this.state.sessionPingInterval);
            this.setState({sessionPingInterval, finishedSession: true, session: {}});
        });
        const sessionPingInterval = setInterval(this.pingSession, PING_SESSION_INTERVAL);
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
        const messages = this.state.messages;
        return (
            <div className={"bulk-sender-wrap"}>
                <LoadSpinner visibility={initiated && !qrUrl && !profileImg && !finished} align={"center"}/>
                {
                    !initiated ? (
                        <button type={"button"} className={"initiate-session"} onClick={this.validateMessages}>SEND WHATSAPP</button>
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
                    (profileImg && contactCount && messages && messages.length) ? (
                        <div>
                            <h3>כרגע נשלחת הודעה ל-{messages[Math.min(processedContactCount, messages.length - 1)].number}</h3>
                            <div>
                                {messages[Math.min(processedContactCount, messages.length - 1)].message}
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