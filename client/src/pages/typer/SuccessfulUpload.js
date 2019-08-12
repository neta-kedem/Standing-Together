import React from 'react';
import server from '../../services/server'
import { withRouter } from 'react-router-dom'
import "./SuccessfulUpload.scss"

export default withRouter(class SuccessfulUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refetchScans: this.props.refetchScans
        };
    };
    logout() {
        server.get('logout', {})
            .then(json => {
                this.props.history.push('/Login')
            });
    }
    render() {
        return (
            <div>
                <div className={"upload-successful-message"}>
                    <h2>ممتاز، تم استيعاب التفاصيل بالمنظومة</h2>
                    <h2>מצויין, הפרטים נקלטו במערכת</h2>
                </div>
                <br/>
                <br/>
                <button className={"upload-successful-button"} onClick={this.state.refetchScans}>بحث صفحات اضافية - חיפוש דפים נוספים להקלדה</button>
                <button className={"upload-successful-button"} onClick={this.logout.bind(this)}>الخروج من النظام - התנתקות מהמערכת</button>
            </div>
        )
    }
})

