import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Meta from '../lib/meta';
import config from '../config';

import ItemService from '../services/ItemService'
import server from '../services/server';

import Popup from '../UIComponents/Popup/Popup'
import Selector from '../UIComponents/Selector/Selector'
import SelectableTable from '../UIComponents/SelectableTable/SelectableTable'
import MultiSelect from '../UIComponents/MultiSelect/MultiSelect'
import HamburgerMenu from '../UIComponents/HamburgerMenu/HamburgerMenu'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar'
import QueryCreator from './organizer/QueryCreator'
import QueryResultsActionMenu from './organizer/QueryResultsActionMenu'
import style from './organizer/Organizer.css'

export default class Organizer extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		query: {/*"profile.firstName":"Noam"*/},
		events: [],
		activists: [],
		currFilters: [],
		allSelected: false,
		tableFields:[
			{title: ["שם", "שם"],  visibility: true, key: "name", icon:"user", type:"text"},
			{title: ["עיר", "עיר"],  visibility: true, key: "city", icon:"building", type:"text"},
			{title: ["טלפון", "טלפון"],  visibility: true, key: "phone", icon:"phone", type:"text"},
			{title: ["אימייל", "אימייל"],  visibility: true, key: "email", icon:"envelope-open", type:"text"},
			{title: ["נראתה לאחרונה", "נראתה לאחרונה"],  visibility: true, key: "lastSeen", icon:"calendar", type:"text"},
			{title: ["אירוע אחרון", "אירוע אחרון"],  visibility: true, key: "lastEvent", icon:"calendar-check", type:"text"},
			{title: ["טלפנית?", "טלפנית?"],  visibility: true, noPadding:true, width:"3em", key: "isCaller", icon:"", type:"toggle", handleChange:this.handleActivistCallerStatusChange.bind(this)}
		],
		displayEventSelectionPopup: false
	};
}

componentDidMount() {
	this.fetchActivistsByQuery(this.state.query);
	this.getPotentialEvents();
	this.getCurrFilters();
}
fetchActivistsByQuery(query){
	server.post('selectActivists', {'query':query})
		.then(json => {
			this.setState({activists:json});
		});
}
getPotentialEvents(){
	server.get('events/getInviteless')
		.then(json => {
			this.setState({events:json});
		});
}
getCurrFilters(){
	ItemService.getCurrFilters()
		.then(currFilters => {
			this.setState({currFilters})
		});
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
render() {
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
			<Meta/>
			<style jsx global>{style}</style>
			<TopNavBar>
				<div className="saved-views-wrap">
					<div className="saved-views">שאילתה 1</div>
					<div className="saved-views">שאילתה 2</div>
				</div>
			</TopNavBar>
			<div className="content-wrap">
				<div className="left-panel">
					<QueryCreator currFilters={this.state.currFilters}></QueryCreator>
				</div>
				<div className="main-panel">
					<QueryResultsActionMenu items={[
						{"index":1, "content":tableFieldsDropdown, "alignToEnd":true}
					]}
					toggleEventPopup={this.handleEventPopupToggle.bind(this)}></QueryResultsActionMenu>
					<div className="results-wrap">
						<div className="query-results">
							<SelectableTable rows={this.state.activists} header={this.state.tableFields}></SelectableTable>
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

