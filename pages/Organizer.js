import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Meta from '../lib/meta';

import ItemService from '../services/ItemService'

import SelectableTable from '../UIComponents/SelectableTable/SelectableTable'
import TopNavBar from './organizer/TopNavbar'
import QueryCreator from './organizer/QueryCreator'
import QueryResultsActionMenu from './organizer/QueryResultsActionMenu'
import style from './organizer/Organizer.css'

export default class Organizer extends React.Component {
constructor(props) {
	super(props);
	this.state = {activists: [], currFilters: [], allSelected: false};
}


componentDidMount() {
	ItemService.getAcivists()
		.then(activists =>
				this.setState({activists}));
	ItemService.getCurrFilters()
		.then(currFilters =>
				this.setState({currFilters}));
}
handleActivistCallerStatusChange(activistIndex, status){
	this.state.activists[activistIndex].isCaller=status;
	ItemService.toggleUserCallerStatus(this.state.activists[activistIndex]._id, status);
}

render() {
	return (
		<div style={style["pageWrap"]}>
			<Meta/>
			<TopNavBar savedViews={[{'name':'New Activists'}, {'name':'Callers in Haifa'}]}></TopNavBar>
			<div style={style.wrapper}>
				<div style={style.leftPanel}>
					<QueryCreator currFilters={this.state.currFilters}></QueryCreator>
				</div>
				<div style={style['main-panel']}>
					<QueryResultsActionMenu></QueryResultsActionMenu>
					<div style={style['results-wrap']}>
						<div style={style['query-results']}>
							<SelectableTable rows={this.state.activists} header={[
								{title: "Name", key: "name", icon:"user", type:"text"},
								{title: "Lives In", key: "city", icon:"building", type:"text"},
								{title: "Phone", key: "phone", icon:"phone", type:"text"},
								{title: "Email", key: "email", icon:"envelope-open", type:"text"},
								{title: "Last Seen", key: "lastSeen", icon:"calendar", type:"text"},
								{title: "Last Event", key: "lastEvent", icon:"calendar-check", type:"text"},
								{title: "Call?", key: "isCaller", icon:"", type:"toggle", handleChange:this.handleActivistCallerStatusChange.bind(this)}
							]}></SelectableTable>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

}

