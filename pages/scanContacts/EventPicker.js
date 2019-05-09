import React from 'react'
import server from '../../services/server'
import PageNav from "../../UIComponents/PageNav/PageNav";

export default class EventManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handleSelection: this.props.handleSelection,
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
    selectEvent(id){
        this.state.handleSelection(id);
    }

    render() {
        const events = this.state.events.slice();
        const currPage = this.state.page;
        const pageCount = this.state.pageCount;
        const rows = events.map((event)=>{
            return <tr key={"event_" + event._id} onClick={()=>{this.selectEvent(event._id)}} className={event._id === this.props.selected ? "selected-event" : ""}>
                <td>{event.date.toLocaleDateString()}</td>
                <td>{event.name}</td>
                <td>{event.location}</td>
            </tr>;
        });
        return (
            <div>
                <table className={"event-table"}>
                    <thead>
                        <tr>
                            <th>
                                <div>تاريخ الحدث</div>
                                <div>תאריך אירוע</div>
                            </th>
                            <th>
                                <div>اسم الحدث</div>
                                <div>שם אירוע</div>
                            </th>
                            <th>
                                <div>مكان الحدث</div>
                                <div>מיקום</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <PageNav currPage={currPage} pageCount={pageCount} goToPage={this.handlePageNavigation.bind(this)}/>
            </div>
        )
    }

}

