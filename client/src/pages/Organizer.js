import React from 'react';
import config from '../services/config';

import QueryService from '../services/queryService';
import server from '../services/server';

import Popup from '../UIComponents/Popup/Popup'
import Selector from '../UIComponents/Selector/Selector'
import SelectableTable from '../UIComponents/SelectableTable/SelectableTable'
import MultiSelect from '../UIComponents/MultiSelect/MultiSelect'
import HamburgerMenu from '../UIComponents/HamburgerMenu/HamburgerMenu'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar'
import QueryCreator from './organizer/QueryCreator'
import QueryResultsActionMenu from './organizer/QueryResultsActionMenu'
import './organizer/Organizer.scss'
import PageNav from "../UIComponents/PageNav/PageNav";
import FileSaver from 'file-saver';

export default class Organizer extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		query: "",
		page: 0,
		pageCount: 1,
		activistCount: 0,
		events: [],
		activists: [],
		currFilters: { logicalOperator:"or", groups: [] },
		allSelected: false,
		tableFields:[
			{title: ["اسم", "שם"],  visibility: true, key: "name", icon:"user", type:"text"},
			{title: ["البلد", "עיר"],  visibility: true, key: "city", icon:"building", type:"text"},
			{title: ["رقم الهاتف", "טלפון"],  visibility: true, key: "phone", icon:"phone", type:"text"},
			{title: ["البريد الإلكتروني", "אימייל"],  visibility: true, key: "email", icon:"envelope-open", type:"text"},
			{title: ["اخر ظهور", "נראתה לאחרונה"],  visibility: true, key: "lastSeen", icon:"calendar", type:"text"},
			{title: ["اخر حدث", "אירוע אחרון"],  visibility: true, key: "lastEvent", icon:"calendar-check", type:"text"},
		],
		displayEventSelectionPopup: false
	};
}

componentDidMount() {
	this.getCurrFilters();
	//this.fetchActivistsByQuery();
	this.getPotentialEvents();
}
fetchActivistsByQuery(){
	let query;
	try {
		query = this.state.query? JSON.parse("{"+this.state.query+"}") : this.getCurrQuery();
	}
	catch(err) {
		console.log(err);
		alert("check your syntax!");
		return;
	}
	server.post('selectActivists', {'query': query, 'page': this.state.page})
		.then(json => {
			if(json.activists)
				this.setState({activists: json.activists, pageCount: json.pageCount, activistCount: json.activistCount});
		});

}
downloadActivistsByQuery(){
	let query;
	try {
		query = this.state.query? JSON.parse("{"+this.state.query+"}") : this.getCurrQuery();
	}
	catch(err) {
		console.log(err);
		alert("check your syntax!");
		return;
	}
	server.post('queryToXLSX', {'query': query})
		.then(json => {
			const blob = new Blob(["\uFEFF" + json.csv], {type: "text/csv;charset=utf-8,%EF%BB%BF"});
			FileSaver.saveAs(blob, "contacts_export.csv");
		});
}
handleQueryChange(event){
	this.setState({query: event.target.value});
}
handleFiltersChange(currFilters){
	this.setState(currFilters)
	this.fetchActivistsByQuery()
}

getPotentialEvents(){
	server.get('events/getInviteless')
		.then(json => {
			if(json.events)
				this.setState({events:json});
		});
}
getCurrFilters(){
	QueryService.getCurrFilters()
		.then(currFilters => {
			this.setState({currFilters}, ()=>{
				this.fetchActivistsByQuery();
			});
		});
}
getCurrQuery() {
	const currFilters = this.state.currFilters;
	// todo neta- complete this
	if(!currFilters.groups.length) return "{}"
	let query = `{"$${currFilters.logicalOperator}": [{`
	currFilters.groups.forEach(group => {
		query += `"$${group.logicalOperator}": [`;
		group.filters.forEach((filter, i) => {
			const filterObj = this.filterMapper(filter)
			let str = ''
			if(i) str = ', {'
			else str = '{'
			str += filterObj.field + ':' + filterObj.body
			query += `${str}}`
		})
		query += "]"
	})
	query += '}]}'
	return query
}

filterMapper(filter) {
	const filterMapper = {
		"מגורים": {field: '"profile.residency"', body: `{"$regex":".*${filter.filterMain}.*"}`, includes: (filter.filterPrefix === 'גר/ה ב')},
		"מעגל": {field: '"profile.circle"', body: `{"$regex":".*${filter.filterMain}.*"}`, includes: (filter.filterPrefix === 'חבר/ה ב')},
		"שם פרטי": {field: '"profile.firstName"', body: `{"$regex":".*${filter.filterMain}.*"}`},
		"שם משפחה": {field: '"profile.lastName"', body: `{"$regex":".*${filter.filterMain}.*"}`},
	}
	return filterMapper[filter.filterName]
}

handlePageNavigation(page){
	this.setState({page: page}, ()=>{
		this.fetchActivistsByQuery();
	});
}
handleFieldDisplayToggle(fieldIndex, status){
	const tableFields = this.state.tableFields.slice();
	tableFields[fieldIndex].visibility=status;
	this.setState({tableFields: tableFields});
}
handleEventPopupToggle(){
	this.setState({
		displayEventSelectionPopup: !this.state.displayEventSelectionPopup,
		campaignCreated: false
	});
}
handleEventSelection(selected){
	server.post('events/inviteByQuery', {'query':this.state.query, 'eventId':selected._id})
		.then(json => {
			this.setState({campaignCreated: true, selectedEventCode: json.eventCode});
			this.getPotentialEvents();
		});
}
goToActivistPage(activist){
	//Router.push({pathname: '/Activist', query: {id: activist._id}}).then(()=>{});
}
render() {
	const currPage = this.state.page;
	const pageCount = this.state.pageCount;
	const activistCount = this.state.activistCount;
	const tableFieldsMultiSelect = <MultiSelect
		values={this.state.tableFields}
		label='key'
		selection='visibility'
		handleChange={this.handleFieldDisplayToggle.bind(this)}/>;
	const tableFieldsDropdown = <HamburgerMenu content={tableFieldsMultiSelect}/>;
	const eventSelector =
		<div>
			<div className="event-selection-popup-title">בחירת אירוע · בחירת אירוע</div>
			<div className="event-selector">
				<Selector
					options={this.state.events}
					idIndex="__id"
					titleIndex="name"
					handleSelection={this.handleEventSelection.bind(this)}
				/>
			</div>
			<a className="new-event-button" href="./EventCreation">
				<div>
					<div>אירוע חדש</div>
					<div>אירוע חדש</div>
				</div>
			</a>
		</div>;
	const eventLink =
		<div className="event-link-wrap">
			<div className="event-link-title">
				<div>לינק לעמוד טלפנים</div>
				<div>לינק לעמוד טלפנים</div>
			</div>
			<input className="event-link" disabled value={config.serverPath+"Caller?eventCode="+this.state.selectedEventCode}/>
			<div className="event-link-ok" onClick={this.handleEventPopupToggle.bind(this)}>
				<div>אוקיי</div>
				<div>אוקיי</div>
			</div>
		</div>;
	return (
		<div className="page-wrap" dir="rtl">
			<TopNavBar>
				<div className="saved-views-wrap">
					{/**<div className="saved-views">שאילתה 1</div>
					<div className="saved-views">שאילתה 2</div>**/}
					<a className="saved-views" href={"./EventManagement"}>manage events</a>
					<a className="saved-views" href={"./ScanContacts"}>scan contacts</a>
				</div>
			</TopNavBar>
			<div className="content-wrap">
				<div className="left-panel">
					<div className="textualQuery">
						<input type={"text"} value={this.state.query} onChange={this.handleQueryChange.bind(this)}/>
						<button type={"button"} onClick={this.fetchActivistsByQuery.bind(this)}>filter</button>
					</div>
					<QueryCreator changeCurrFilters={this.handleFiltersChange.bind(this)} />
				</div>
				<div className="main-panel">
					<QueryResultsActionMenu
						items={[{"index": 1, "content": tableFieldsDropdown, "alignToEnd": true}]}
						toggleEventPopup={this.handleEventPopupToggle.bind(this)}
						activistCount={activistCount}
						downloadActivistsByQuery={this.downloadActivistsByQuery.bind(this)}
					> </QueryResultsActionMenu>
					<div className="results-wrap">
						<div className="query-results">
							<SelectableTable rows={this.state.activists} rowKey="_id" header={this.state.tableFields} onDoubleClick={this.goToActivistPage.bind(this)}/>
							<PageNav currPage={currPage} pageCount={pageCount} goToPage={this.handlePageNavigation.bind(this)}/>
						</div>
					</div>
				</div>
				<Popup visibility={this.state.displayEventSelectionPopup} toggleVisibility={this.handleEventPopupToggle.bind(this)}>
					{this.state.campaignCreated?eventLink:eventSelector}
				</Popup>
			</div>
		</div>
	)
}

}

