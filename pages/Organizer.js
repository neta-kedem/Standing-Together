import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Meta from '../lib/meta';

import ItemService from '../services/ItemService'
import server from '../services/server';

import SelectableTable from '../UIComponents/SelectableTable/SelectableTable'
import MultiSelect from '../UIComponents/MultiSelect/MultiSelect'
import HamburgerMenu from '../UIComponents/HamburgerMenu/HamburgerMenu'
import TopNavBar from './organizer/TopNavbar'
import QueryCreator from './organizer/QueryCreator'
import QueryResultsActionMenu from './organizer/QueryResultsActionMenu'
import style from './organizer/Organizer.css'

export default class Organizer extends React.Component {
constructor(props) {
	super(props);
	this.state = {activists: [], currFilters: [], allSelected: false,
	tableFields:[
		{title: "Name", visibility: true, key: "name", icon:"user", type:"text"},
		{title: "Lives In",  visibility: true, key: "city", icon:"building", type:"text"},
		{title: "Phone",  visibility: true, key: "phone", icon:"phone", type:"text"},
		{title: "Email",  visibility: true, key: "email", icon:"envelope-open", type:"text"},
		{title: "Last Seen",  visibility: false, key: "lastSeen", icon:"calendar", type:"text"},
		{title: "Last Event",  visibility: true, key: "lastEvent", icon:"calendar-check", type:"text"},
		{title: "Call?",  visibility: true, width:"3em", key: "isCaller", icon:"", type:"toggle", handleChange:this.handleActivistCallerStatusChange.bind(this)}
	]};
}

componentDidMount() {
	server.get('activists')
		.then(json => {
			this.setState({activists:json});
		});
	ItemService.getCurrFilters()
		.then(currFilters =>
				this.setState({currFilters}));
}
handleActivistCallerStatusChange(activistIndex, status){
	const activists = this.state.activists.slice();
	activists[activistIndex].isCaller=status;
	this.setState({activists: activists});
	server.post('activists/toggleStatus', {'status':status, 'activistId':this.state.activists[activistIndex]._id});
}
handleFieldDisplayToggle(fieldIndex, status){
	const tableFields = this.state.tableFields.slice();
	tableFields[fieldIndex].visibility=status;
	this.setState({tableFields: tableFields});
}
render() {
	const tableFieldsMultiSelect = <MultiSelect
		values={this.state.tableFields}
		label='title'
		selection='visibility'
		handleChange={this.handleFieldDisplayToggle.bind(this)}/>;
	const tableFieldsDropdown = <HamburgerMenu content={tableFieldsMultiSelect}/>;

	return (
		<div className="page-wrap">
			<Meta/>
			<style jsx global>{style}</style>
			<TopNavBar savedViews={[{'name':'New Activists'}, {'name':'Callers in Haifa'}]}></TopNavBar>
			<div className="wrapper">
				<div className="left-panel">
					<QueryCreator currFilters={this.state.currFilters}></QueryCreator>
				</div>
				<div className="main-panel">
					<QueryResultsActionMenu items={[
						{"index":1, "content":tableFieldsDropdown, "alignToEnd":true}
					]}></QueryResultsActionMenu>
					<div className="results-wrap">
						<div className="query-results">
							<SelectableTable rows={this.state.activists} header={this.state.tableFields}></SelectableTable>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

}

