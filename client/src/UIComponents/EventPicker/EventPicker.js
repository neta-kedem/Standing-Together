import React from 'react'
import server from '../../services/server'
import PageNav from "../PageNav/PageNav"
import SearchBar from "../SearchBar/SearchBar"
import "./EventPicker.scss"
import LoadSpinner from "../LoadSpinner/LoadSpinner";

export default class EventPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handleSelection: this.props.handleSelection,
            page: 0,
            pageCount: 0,
            events: [],
            search: this.props.initSearch ? this.props.initSearch : "",
            loading: false,
        }
    }
    componentDidMount() {
        this.getListDetails();
    }
    getListDetails() {
        const search = this.state.search || "";
        this.setState({loading: true});
        server.post('events/list', {'page': this.state.page, 'search': search})
            .then(result => {
                const events = result.events || [];
                this.setState({events: events.map((event)=>{
                    let e = event;
                    e.date = new Date(e.date);
                    e.creationDate = new Date(e.creationDate);
                    return e;
                }
                ), pageCount: result.pageCount, loading: false});
            });
    }
    handlePageNavigation(page){
        this.setState({page: page}, ()=>{
            this.getListDetails();
        });
    }
    handleSearch(search){
        this.setState({page: 0, search: search}, ()=>{
            this.getListDetails();
        });
    }
    selectEvent(event){
        this.state.handleSelection(event._id, event);
    }

    render() {
        const events = this.state.events.slice();
        const currPage = this.state.page;
        const pageCount = this.state.pageCount;
        const rows = events.map((event)=>{
            return <tr key={"event_" + event._id} onClick={()=>{this.selectEvent(event)}} className={event._id === this.props.selected ? "selected-event" : ""}>
                <td>{event.date.toLocaleDateString()}</td>
                <td>{event.name}</td>
                <td>{event.location}</td>
            </tr>;
        });
        return (
            <div>
                <SearchBar placeholder={"חיפוש אירועים"} initVal={this.state.search} onSearch={this.handleSearch.bind(this)}/>
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
                <LoadSpinner visibility={(this.state.loading && !events.length)} align={"center"}/>
                <PageNav currPage={currPage} pageCount={pageCount} goToPage={this.handlePageNavigation.bind(this)}/>
            </div>
        )
    }
}

