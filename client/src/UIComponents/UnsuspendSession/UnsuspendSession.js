import React from 'react';
import server from '../../services/server';
import { withRouter } from 'react-router-dom'
import './UnsuspendSession.scss'
import PubSub from "pubsub-js";
import events from "../../lib/events";

export default withRouter(class UnsuspendSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onSuccess: this.props.onSuccess,
            sentCode: false,
            code: ""
        }
    }

    sendUnsuspendMail = function(){
        server.get('suspend/sendCode', {})
            .then(() => {
                this.setState({sentCode: true})
            });
    }.bind(this);

    unsuspend = function(){
        server.post('suspend/unsuspend', {code: this.state.code})
            .then((res) => {
                if(res === true)
                    this.state.onSuccess();
            });
    }.bind(this);

    logout = function(){
        server.get('logout', {})
            .then(() => {
                this.props.history.push('/Login');
                PubSub.publish(events.clearAlert, {clearAll: true});
            });
    }.bind(this);

    render() {
        const sentCode = this.state.sentCode;
        return (
            <div className={"unsuspend-session-wrap"} dir="rtl">
                <div>
                    עברו 7 דקות או יותר מאז הפעולה האחרונה במערכת, ולכן היא ננעלה.
                    כדי להמשיך מאיפה שעצרת, ליחצו על הכפתור לקבלת קוד במייל - הקוד יעבוד רק אם לא עברה שעה מאז ה.
                    לחילופין, תוכלו להתנתק מהמערכת ולהתחבר מחדש.
                </div>
                {/*<div>
                    עברו 7 דקות או יותר מאז הפעולה האחרונה במערכת, ולכן היא ננעלה.
                    כדי להמשיך מאיפה שעצרת, ליחצו על הכפתור לקבלת קוד במייל - הקוד יעבוד רק אם לא עברה שעה מאז ה.
                    לחילופין, תוכלו להתנתק מהמערכת ולהתחבר מחדש.
                </div>*/}
                {
                    !sentCode
                        ? <div>
                            <button type={"button"} className={"unsuspend-session-button"} onClick={this.sendUnsuspendMail}>
                                שליחת קוד
                            </button>
                            <button type={"button"} className={"unsuspend-session-button"} onClick={this.logout}>
                                התנתקות
                            </button>
                        </div>
                        :<div>
                            <input type={"text"} className={"unsuspend-session-input"} onChange={(e) => {this.setState({code: e.target.value})}}/>
                            <button type={"button"} className={"unsuspend-session-button"} onClick={this.unsuspend}>
                                אימות קוד
                            </button>
                        </div>
                }
            </div>
        )
    }
})
