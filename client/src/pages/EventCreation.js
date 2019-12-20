import React from 'react'
import server from '../services/server'
import './eventCreation/EventCreation.scss'
import QueryString from 'query-string';
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSave} from '@fortawesome/free-solid-svg-icons'
library.add(faSave);

export default class EventCreation extends React.Component {
constructor(props) {
	super(props);
	const today = new Date();
	this.state = {
		_id: QueryString.parse(props.location.search, { ignoreQueryPrefix: true }).id,
		title: "",
		date: today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear(),
		category: "",
		location: "",
		categories: [],
		cities: [],
		scans: [],
	};
	if(this.state["_id"]){
		this.fetchEventDetails();
	}
	this.fetchCategories();
	this.fetchCities();
	this.fetchScans();
}
fetchEventDetails(){
	server.get('events/eventById/'+this.state._id)
		.then(event => {
			if(!event.eventDetails)
				return;
			const date = new Date(event.eventDetails.date);
			const dateString = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
			this.setState({
				title: event.eventDetails.name,
				location: event.eventDetails.location,
				date: dateString,
				category: event.eventDetails.category
			});
		});
}
fetchCategories() {
	server.get('eventCategories', {})
		.then(eventCategories => {
			this.setState({"categories": eventCategories});
		});
}
fetchCities(){
	server.get('cities/', {})
		.then(json => {
			this.setState({cities: json.map((city)=>{return city.nameHe;})})
		});
}
fetchScans() {
	server.get(`contactScan/list/?eventId=${this.state._id}`)
		.then(scans=>this.setState({scans: scans.scans}));
}
handleInputChange(event) {
	const target = event.target;
	const value = target.type === 'checkbox' ? target.checked : target.value;
	const name = target.name;
	this.setState({
		[name]: value
	});
}
validateEvent() {
	if(!this.state.title.length)
	{
		alert("please provide a title for the event");
		return false;
	}
	if(!this.state.date.length)
	{
		alert("please provide a date for the event");
		return false;
	}
	if(!this.state.category || !this.state.category.length)
	{
		alert("please provide a category for the event");
		return false;
	}
	return true;
}
handlePost() {
	if(!this.validateEvent())
		return;
	let eventObject = {
		"_id": this.state._id,
		"eventDetails":{
			"name": this.state.title,
			"date": this.state.date,
			"location": this.state.location,
			"category": this.state.category,
		},
		"callInstructions": {
		}
	};
	server.post('events', {'event':eventObject})
	.then(() => {
		alert("האירוע נשמר!");
		this.props.history.push('/Organizer');
	});
}

handleScanRowClick(scan) {
	window.location.href = `/Typer?contactScan=${scan._id}`;
}

handleScanDeletion(scanIndex) {
	const scans = this.state.scans.slice();
	server.post('contactScan/delete', {'scanId': scans[scanIndex]._id})
		.then(() => {
			scans.splice(scanIndex, 1);
			this.setState({scans});
			alert("הסריקה הוסרה");
		});
}

render() {
	const categories = this.state.categories.slice();
	const catOptions = categories.map((cat)=>{
		return <option key={"cat_" + cat._id} value={cat._id}>{cat.name.he}</option>
	});
	const rows = this.state.scans.map((scan, i)=> {
			const preview = (scan.scanUrl === "fromCSV") ? "/static/media/Excel.be1669c6.svg" : "../uploads/contactScans/" + scan.scanUrl;
			return <tr key={scan._id}>
				<td className="delete-row-wrap" onClick={() => this.handleScanDeletion(i)}>
					<FontAwesomeIcon className="delete-row" icon="trash-alt"/>
				</td>
				<td onClick={() => this.handleScanRowClick(scan)}>
					<img
						style={{height: "5em"}}
						src={preview}
					/>
				</td>
				<td>
					{new Date(scan.metadata.creationDate).toLocaleDateString()}
				</td>
				<td>
					{new Date(scan.metadata.lastUpdate).toLocaleDateString()}
				</td>
				<td>
					{scan.activists.length}
				</td>
			</tr>
		}
	);
	return (
		<div style={{'height':'100vh'}} className={"page-wrap-event-creation"}>
			<TopNavBar>
				<div className="title-wrap">
					<span className="title-lang">انشاء حدث</span>
					<span className="title-lang">יצירת אירוע</span>
				</div>
			</TopNavBar>
			<div dir="rtl" className="content-wrap">
				<div className="event-details-wrap">
					<label className="label" id="event-name">
						<div>اسم الحدث<br/>שם האירוע</div>
						<input size="80" type="text" name="title" value={this.state.title} onChange={this.handleInputChange.bind(this)}/>
					</label>
					<label className="label" id="event-date">
						<div>التاريخ<br/>תאריך</div>
						<input size="80" dir="ltr" type="text" name="date" value={this.state.date} onChange={this.handleInputChange.bind(this)} placeholder="DD.MM.YYYY"/>
					</label>
					<label className="label" id="event-location">
						<div>مكان الحدث<br/>מיקום</div>
						<input type="text" name="location" list="city-data-list" value={this.state.location} onChange={this.handleInputChange.bind(this)}/>
					</label>
					<label className="label" id="event-cat">
						<div>فئة<br/>קטגוריה</div>
						<select dir="rtl" name="category" value={this.state.category} onChange={this.handleInputChange.bind(this)}>
							<option value={""}/>
							{catOptions}
						</select>
					</label>
					<div onClick={this.handlePost.bind(this)} className="save-event-button">
						<div className="save-event-button-label">
							<div>حفظ</div>
							<div>שמירה</div>
						</div>
						<div className="save-event-button-icon">
							<FontAwesomeIcon icon="save"/>
						</div>
					</div>
					<div>
						<table dir="rtl" className="event-table">
							<thead>
								<tr>
									<th className="delete-row-wrap"/>
									<th>
										<div>דף</div>
									</th>
									<th>
										<div>תאריך העלאה</div>
									</th>
									<th>
										<div>תאריך עדכון אחרון</div>
									</th>
									<th>
										<div>#רשומות</div>
									</th>
								</tr>
							</thead>
							<tbody className="row-wrap">
								{rows}
							</tbody>
						</table>
					</div>
					<datalist id="city-data-list">
						<option value={"מקוון"}/>
						<option value={"השטחים הכבושים"}/>
						{this.state.cities.map((city)=>{
							return <option key={"city-op-"+city} value={city}/>
						})}
					</datalist>
				</div>
			</div>
		</div>
	)
}

}

