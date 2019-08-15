import React from 'react';
import config from '../services/config';
import server from '../services/server';

import Popup from '../UIComponents/Popup/Popup'
import Selector from '../UIComponents/Selector/Selector'
import SelectableTable from '../UIComponents/SelectableTable/SelectableTable'
import MultiSelect from '../UIComponents/MultiSelect/MultiSelect'
import HamburgerMenu from '../UIComponents/HamburgerMenu/HamburgerMenu'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar'
import FilterFields from './organizer/FilterFields'
import QueryCreator from './organizer/QueryCreator'
import QueryResultsActionMenu from './organizer/QueryResultsActionMenu'
import PageNav from "../UIComponents/PageNav/PageNav";
import FileSaver from 'file-saver';
import './organizer/Organizer.scss'


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
		fieldsFilterOptions: FilterFields.fieldsFilterOptions,
		filterableFields: FilterFields.filterableFields,
		currFilters: {
			outerOr: true,
			groups: [
				{
					filters: [
						{fieldType: "circle", value: "תל אביב - יפו", option:"associatedWith"},
						{fieldType: "firstName", value: "נטע", option:"includes"},
					]
				}
			]
		},
		allSelected: false,
		tableFields:[
			{title: ["اسم", "שם"],  visibility: true, key: "name", icon:"user", type:"text", width:"15em"},
			{title: ["البلد", "עיר"],  visibility: true, key: "city", icon:"building", type:"text", width:"12em"},
			{title: ["رقم الهاتف", "טלפון"],  visibility: true, key: "phone", icon:"phone", type:"text", width:"12em"},
			{title: ["البريد الإلكتروني", "אימייל"],  visibility: true, key: "email", icon:"envelope-open", type:"text", width:"15em"},
			{title: ["اخر ظهور", "נראתה לאחרונה"],  visibility: false, key: "lastSeen", icon:"calendar", type:"text", width:"12em"},
			{title: ["اخر حدث", "אירוע אחרון"],  visibility: false, key: "lastEvent", icon:"calendar-check", type:"text", width:"8em"},
		],
		displayEventSelectionPopup: false
	};
}

componentDidMount() {
	this.getPotentialEvents();
}

handleQueryChange(query) {
	this.setState({query: query}, () => {
		this.fetchActivistsByQuery();
	});
}

fetchActivistsByQuery(){
	let query = this.state.query;
	server.post('selectActivists', {'query': query, 'page': this.state.page})
		.then(json => {
			if(json && json.activists)
				this.setState({activists: json.activists, pageCount: json.pageCount, activistCount: json.activistCount});
		});
}

downloadActivistsByQuery(){
	const query = this.state.query;
	server.post('queryToXLSX', {'query': query})
		.then(json => {
			const blob = new Blob(["\uFEFF" + json.csv], {type: "text/csv;charset=utf-8,%EF%BB%BF"});
			FileSaver.saveAs(blob, "contacts_export.csv");
		});
}

getPotentialEvents(){
	server.get('events/getInviteless')
		.then(json => {
			if(json.events)
				this.setState({events:json});
		});
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
	this.props.history.push('/Activist?id='+activist._id);
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
			<a className="new-event-button" href="./EventCreation.js">
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
		<div className="page-wrap page-wrap-organizer" dir="rtl">
			<TopNavBar>
				<div className="title-wrap">
					<span className="title-lang">ניהול אנשי קשר</span>
					<span className="title-lang">ניהול אנשי קשר</span>
				</div>
			</TopNavBar>
			<div className="content-wrap">
				<div className="left-panel">
					<QueryCreator
						changeCurrFilters={this.handleQueryChange.bind(this)}
						initFilters={this.state.currFilters}
						filterableFields={this.state.filterableFields}
						fieldsFilterOptions={this.state.fieldsFilterOptions}
					/>
					<br/>
					<div className="textual-query hidden">
						{this.state.query}
					</div>
				</div>
				<div className="main-panel">
					<QueryResultsActionMenu
						items={[{"index": 1, "content": tableFieldsDropdown, "alignToEnd": true}]}
						toggleEventPopup={this.handleEventPopupToggle.bind(this)}
						activistCount={activistCount}
						downloadActivistsByQuery={this.downloadActivistsByQuery.bind(this)}
					/>
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