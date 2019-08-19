import React from 'react';
import "./LogoutReminder.scss"
import Checkbox from "../../UIComponents/Checkbox/Checkbox"
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUserSecret} from '@fortawesome/free-solid-svg-icons'
library.add(faUserSecret);

export default class LogoutReminder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPersonalComputer: false,
            onClose: this.props.onClose
        };
    }

    render() {
        return (
            <div className={"logout-reminder-wrap"}>
                <div className={"logout-reminder-logo"}>
                    <FontAwesomeIcon icon={"user-secret"}/>
                </div>
                <div>
                    <h3>שימו לב!</h3>
                    <p>זו מערכת פנימית של תנועת עומדים ביחד, שמכילה מידע רגיש.</p>
                    <p>אם ניגשת למערכת ממחשב ציבורי (בספרייה, לדוגמה), או שלאחרים יש גישה אליו, מומלץ מאוד לעבוד בחלון גלישה בסתר (Incognito).</p>
                    <p>באופן הזה, כשתסגרו את הדפדפן, תנותקו מהמערכת באופן אוטומטי.</p>
                    <p>ניתן לפתוח חלון גלישה בסתר באמצעות צירוף המקשים ctrl+shift+N.</p>
                    <a href="https://support.google.com/chrome/answer/95464?co=GENIE.Platform%3DDesktop&hl=en">עוד על חלון הגלישה בסתר</a>
                    <p>תוכלו להתנתק מהמערכת גם באופן ידני, באמצעות כפתור "התנתקות" בתפריט.</p>
                    <p>במקרה שעבדת על מכשיר ציבורי, חשוב להתנתק לא רק מהמערכת, אלא גם מחשבון המייל - אחרת ניתן יהיה להשתמש בו כדי להיכנס למערכת מחדש.</p>
                </div>
                <div>
                    <Checkbox
                        checked={this.state.isPersonalComputer}
                        onChange={(val)=>this.setState({isPersonalComputer: val})}
                        label="זה המחשב האישי שלי, אין צורך להציג את ההודעה הזו בעתיד"/>
                </div>
                <button type={"button"} className="continue-to-login-button"
                        onClick={()=>{this.state.onClose(this.state.isPersonalComputer)}}>
                    הבנתי
                </button>
            </div>
        )
    }
}
