import React from 'react'
import './eventManagement/eventManagement.scss'
import {Link, withRouter} from "react-router-dom";
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';
import EventPicker from "../UIComponents/EventPicker/EventPicker";
export default withRouter(class EventManagement extends React.Component {
    constructor(props) {
        super(props);
    }
    goToEvent(id){
        this.props.history.push('/EventCreation?id='+id);
    }

    render() {
        return (
            <div dir={"rtl"} className={"page-wrap-event-management"}>
                <TopNavBar>
                    <div className="title-wrap">
                        <span className="title-lang">ادارة احداث</span>
                        <span className="title-lang">ניהול אירועים</span>
                    </div>
                </TopNavBar>
                <EventPicker handleSelection={this.goToEvent.bind(this)}/>
                <Link to="/EventCreation" className={"new-event-link"}>
                <div>
                    ادارة احداث - יצירת אירוע חדש
                </div>
                </Link>
            </div>
        )
    }

});

