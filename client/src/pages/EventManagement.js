import React from 'react'
import server from '../services/server'
import './eventManagement/eventManagement.scss'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';
import PageNav from "../UIComponents/PageNav/PageNav";

export default class EventManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            pageCount: 0,
            events: []
        }
    }
    componentDidMount() {
        this.getListDetails();
    }
    getListDetails() {
        server.post('events/list', {'page':this.state.page})
            .then(result => {
                const events = result.events;
                this.setState({events: events.map((event)=>{
                    let e = event;
                    e.date = new Date(e.date);
                    e.creationDate = new Date(e.creationDate);
                    return e;
                }
                ), pageCount: result.pageCount});
            });
    }
    handlePageNavigation(page){
        this.setState({page: page}, ()=>{
            this.getListDetails();
        });
    }
    goToEvent(id){
        this.props.history.push('/EventCreation?id='+id);
    }

    render() {
        const events = this.state.events.slice();
        const currPage = this.state.page;
        const pageCount = this.state.pageCount;
        const rows = events.map((event)=>{
            return <tr key={"event_" + event._id} onClick={()=>{this.goToEvent(event._id)}}>
                <td>{event.date.toLocaleDateString()}</td>
                <td>{event.name}</td>
                <td>{event.location}</td>
                <td>{event.creationDate.toLocaleDateString()}</td>
            </tr>;
        });
        return (
            <div dir={"rtl"} className={"page-wrap-event-management"}>
                <TopNavBar>
                    <div className="title-wrap">
                        <span className="title-lang">ادارة احداث</span>
                        <span className="title-lang">ניהול אירועים</span>
                    </div>
                </TopNavBar>
                <table className={"event-table"}>
                    <thead>
                        <tr>
                            <th>
                                <div>التاريخ</div>
                                <div>תאריך אירוע</div>
                            </th>
                            <th>
                                <div>اسم الحدث</div>
                                <div>שם אירוע</div>
                            </th>
                            <th>
                                <div>التاريخ</div>
                                <div>מיקום</div>
                            </th>
                            <th>
                                <div>تاريخ الانشاء</div>
                                <div>תאריך יצירה</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <PageNav currPage={currPage} pageCount={pageCount} goToPage={this.handlePageNavigation.bind(this)}/>
                <a href={"./EventCreation"} className={"new-event-link"}>
                <div>
                    ادارة احداث - יצירת אירוע חדש
                </div>
                </a>
            </div>
        )
    }

}

