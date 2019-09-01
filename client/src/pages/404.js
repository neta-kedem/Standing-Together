import React from 'react'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';
import "./404/404.scss"

export default class EventCategoriesManagement extends React.Component {
    render() {
        return (
            <div className={"page-wrap-event-categories-management"}>
                <TopNavBar>
                    <div className="title-wrap">
                        <span className="title-lang">העמוד לא נמצא</span>
                        <span className="title-lang">העמוד לא נמצא</span>
                    </div>
                </TopNavBar>
                <div className={"not-found-message"}>
                    <div style={{fontWeight: "bold"}}>404</div>
                    <div>העמוד לא קיים במערכת</div>
                </div>
            </div>
        )
    }
}