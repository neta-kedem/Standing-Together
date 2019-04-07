import React from 'react'
import server from '../services/server'
import Meta from '../lib/meta'
import style from './eventManagement/eventManagement.css'
import Router from "next/router";
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';

export default class EventManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            events: []
        }
    }
    componentDidMount() {
        this.getListDetails();
    }
    getListDetails(event) {
        server.get('events/list', {'page':this.state.page})
            .then(events => {
                this.setState({events: events.map((event)=>{
                    let e = event;
                    e.date = new Date(e.date);
                    e.creationDate = new Date(e.creationDate);
                    return e;
                }
                )});
            });
    }
    goToEvent(id){
        Router.push({pathname: '/EventCreation', query: {id: id}}).then(()=>{});
    }

    render() {
        const events = this.state.events.slice();
        const rows = events.map((event,i)=>{
            const campaignLink = <a href={"/Caller/?eventCode="+event.campaignUrl}>🔗</a>;
            return <tr key={"event_"+i} onClick={()=>{this.goToEvent(event._id)}}>
                <td>{event.date.toLocaleDateString()}</td>
                <td>{event.name}</td>
                <td>{event.location}</td>
                <td>{event.creationDate.toLocaleDateString()}</td>
                <td>{event.campaign?campaignLink:"X"}</td>
            </tr>;
        });
        return (
            <div>
                <Meta/>
                <style jsx global>{style}</style>
                <TopNavBar>
                    <div className="title-wrap">
                        <span className="title-lang">ניהול מפגשים</span>
                        <span className="title-lang">ניהול מפגשים</span>
                    </div>
                </TopNavBar>
                <table className={"event-table"}>
                    <thead>
                        <tr>
                            <th>
                                <div>תאריך אירוע</div>
                                <div>תאריך אירוע</div>
                            </th>
                            <th>
                                <div>שם אירוע</div>
                                <div>שם אירוע</div>
                            </th>
                            <th>
                                <div>מיקום</div>
                                <div>מיקום</div>
                            </th>
                            <th>
                                <div>תאריך יצירה</div>
                                <div>תאריך יצירה</div>
                            </th>
                            <th>
                                <div>קמפיין טלפנות התחיל</div>
                                <div>קמפיין טלפנות התחיל</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        )
    }

}

