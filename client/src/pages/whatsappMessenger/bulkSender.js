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
            displayEditor: this.props.displayEditor,
            loadingSession: false,
            initiatedSession: false,
            sessionId: null,
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
                    <h3 style={{marginTop: 0}}>قسم من ارقام الهاتف او البرامترات ناقصة</h3>
                    <h3>חלק ממספרי הטלפון או הפרמטרים חסרים</h3>
                    <p>تأكدوا من ان ارقام الهاتف مكتوبين بالصيغة التالية 972123456789، وانه لا يوجد خانات فارغة</p>
                    <p>וודאו שכל הטלפונים הם בפורמט 972123456789, ואין פרמטרים ריקים בשום רשומה</p>
                </div>,
                flush: false,
                opaque: false,
                onClose: () => {this.state.displayEditor()},
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
                    <h2 style={{marginTop: 0}}>بقائمة المرسل اليهم يوجد اكثر من {MAX_CONTACTS_WITHOUT_WARNING} تسجيل</h2>
                    <h2 style={{marginTop: 0}}>ברשימת הנמענים יש יותר מ-{MAX_CONTACTS_WITHOUT_WARNING} רשומות</h2>
                    <p>ارسال الكثير من رسائل الواتساب دفعة واحدة يمكن ان توقف حسابك الواتساب (للابد)</p>
                    <p>في حال ان المحفوظات طويلة، مفضل ارسالها اكثر من مرة بشكل مقطع، والانتظاربعض دقائق بين ارسال كل مقطعين، او ارسال الرسالة من حسابات مختلفة.</p>
                    <p>اذا لتقييمك اغلب المرسل اليهم حفظوك في سجل جهات الاتصال الخاص بهم، او على الاقل يعرفونك، لن تكون اي مشكلة.</p>
                    <p>والا، مفضل ان تطلب من من نشطاء اخرين المساعدة بارسال الرسائل او شراء SIM مخصوصا لذلك.</p>
                    <p>שליחת הרבה הודעות וואטצאפ בבת אחת עלולה לגרור חסימה של חשבון הוואטצאפ שלך (לנצח).</p>
                    <p>במקרה של רשימות ארוכות, מומלץ לפצל את השליחה ליותר מחלק אחד, ולחכות כמה דקות בין שליחת החלקים, או לשלוח את ההודעות ממשתמשים שונים.</p>
                    <p>אם להערכתך רוב הנמענים שמרו אותך ברשימת אנשי הקשר שלהם, או לפחות מכירים אותך, לא תהיה בעיה.</p>
                    <p>אחרת, שווה לשקול לבקש מפעילים אחרים בתנועה לעזור בשליחת ההודעות, או לקנות SIM ייעודי.</p>
                </div>,
                flush: false,
                opaque: false,
                onClose: () => {this.state.displayEditor()},
                resolutionOptions: [
                    {
                        label: "בסדר, לא לשלוח בינתיים",
                        onClick: () => {
                            this.state.displayEditor();
                            PubSub.publish(events.clearAlert, {});
                            },
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
        const sessionIdGen = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
            s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
        const sessionId = sessionIdGen();
        this.setState({session, sessionId: sessionId, initiatedSession: true, loadingSession: true});
        server.post('whatsapp/send', {
            messages: messages,
            sessionId: sessionId,
        }).then(result => {
            if(this.state.sessionPingInterval)
                clearInterval(this.state.sessionPingInterval);
            this.setState({sessionPingInterval, finishedSession: true, session: {}});
        });
        const sessionPingInterval = setInterval(this.pingSession, PING_SESSION_INTERVAL);
    }.bind(this);

    pingSession = function(){
        server.get('whatsapp/progress/' + this.state.sessionId).then(session => {
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
                        <div>
                            <h1>امسح ال QR الموجود بتطبيق الواتساب</h1>
                            <h1>סרקו את ה-QR מתוך אפליקציית הוואטצאפ בטלפון</h1>
                            <div className={"whatsapp-qr-wrap"}>
                                <img alt={"qr"} className={"whatsapp-qr"} src={qrUrl}/>
                                <img alt={"qr-logo"} className={"whatsapp-logo-overlay"} src={whatsappLogoOverlay}/>
                            </div>
                        </div>
                    ) : null
                }
                {
                    (profileImg) ? (
                        <div>
                            <h1>بدأنا بارسال الرسائل</h1>
                            <h1>התחלנו לשלוח את ההודעות</h1>
                            <div className={"profile-image-wrap"}>
                                <div className={"profile-image-label"}>الرسائل ارسلو من:</div>
                                <div className={"profile-image-label"}>ההודעות נשלחות מ:</div>
                                <img alt={"profile"} className={"profile-image"} src={this.cleanProfileImageUrl(profileImg)}/>
                            </div>
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
                            <h3>الان ترسل الرسالة ل-{messages[Math.min(processedContactCount, messages.length - 1)].number}</h3>
                            <div className={"text-bubble"}>
                                {messages[Math.min(processedContactCount, messages.length - 1)].message.split("%0a").map((paragraph, i) =>
                                    <p key={"message-" + processedContactCount + "-paragraph-" + i}>{paragraph}</p>
                                )}
                            </div>
                        </div>
                    ) : null
                }
                {
                    (finished) ? (
                        <div className={"done-message"}>
                            <div>انتهينا!</div>
                            <div>סיימנו!</div>
                        </div>
                    ) : null
                }
            </div>
        )
    }
}