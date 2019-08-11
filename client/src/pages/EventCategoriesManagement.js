import React from 'react'
import server from '../services/server'
import Meta from '../lib/meta'
import EventCategoriesDetails from './eventCategoriesManagement/EventCategoriesDetails'
import style from './eventCategoriesManagement/EventCategoriesManagement.scss'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';

export default class EventCategoriesManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventCategories: []
        }
    }
    componentDidMount() {
        this.getEventCategories();
    }
    getEventCategories() {
        server.get('eventCategories', {})
            .then(eventCategories => {
                this.setState({"eventCategories": eventCategories});
            });
    }
    setEventCategoryHe(name, index) {
        let eventCategories = this.state.eventCategories.slice();
        eventCategories[index].name.he = name;
        eventCategories[index].changed = true;
        this.setState({eventCategories: eventCategories})
    }
    setEventCategoryAr(name, index) {
        let eventCategories = this.state.eventCategories.slice();
        eventCategories[index].name.ar = name;
        eventCategories[index].changed = true;
        this.setState({eventCategories: eventCategories})
    }
    createEventCategory() {
        let eventCategories = this.state.eventCategories.slice();
        eventCategories.push({changed: true, name:{he:"", ar:""}});
        this.setState({eventCategories: eventCategories})
    }
    saveEventCategories() {
        let changedCategories = this.state.eventCategories.slice().filter((eventCategory)=>{return eventCategory.changed});
        server.post('eventCategories', {eventCategories: changedCategories});
        alert("saved!");
        this.getEventCategories();
    }

    render() {
        const cats = this.state.eventCategories.slice();
        const rows = cats.map((cat,i)=>{
            return <EventCategoriesDetails
                values={cat}
                key={"cat_"+cat._id+"_"+i}
                setHe={this.setEventCategoryHe.bind(this)}
                setAr={this.setEventCategoryAr.bind(this)}
                rowIndex={i}
            />;
        });
        return (
            <div>
                <Meta/>
                <TopNavBar>
                    <div className="title-wrap">
                        <span className="title-lang">ניהול קטגוריות אירועים</span>
                        <span className="title-lang">ניהול קטגוריות אירועים</span>
                    </div>
                </TopNavBar>
                <table className={"event-cat-table"}>
                    <thead>
                        <tr>
                            <th>
                                <div>שם קטגוריה</div>
                            </th>
                            <th>
                                <div>שם קטגוריה</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <button type="button" className="add-event-cat-button" onClick={this.createEventCategory.bind(this)}>הוספת קטגוריה</button>
                <button type="button" className="save-event-cats-button" onClick={this.saveEventCategories.bind(this)}>שמירה</button>
            </div>
        )
    }

}

