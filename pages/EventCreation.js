import React from 'react'
import Router from 'next/router'
import server from '../services/server'
import Meta from '../lib/meta'
import style from './eventCreation/EventCreation.css'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {faShareSquare} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faShareSquare);

export default class EventCreation extends React.Component {
constructor(props) {
	super(props);
	const today = new Date();
	this.state = {
		_id: props.url.query.id,
		title: "",
		date: today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear(),
		category: null,
		categories: []
	};
	if(this.state["_id"]){
		this.fetchEventDetails();
		this.fetchCategories();
	}
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
	if(!this.state.category)
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
			"location": "somewhere over the rainbow",
			"category": this.state.category,
		},
		"callInstructions": {
		}
	};
	server.post('events', {'event':eventObject})
	.then(() => {
		alert("saved");
		Router.push({pathname: '/Organizer'}).then(()=>{});
	});
}

render() {
	const categories = this.state.categories.slice();
	return (
		<div style={{'height':'100vh'}}>
			<Meta/>
			<style jsx global>{style}</style>
			<TopNavBar>
				<div onClick={this.handlePost.bind(this)} className="save-event-button">
					<div className="save-event-button-label">
						<div>שמירה</div>
						<div>שמירה</div>
					</div>
					<div className="save-event-button-icon">
						<FontAwesomeIcon icon="share-square"/>
					</div>
				</div>
			</TopNavBar>
			<div dir="rtl" className="content-wrap">
				<div className="event-details-wrap">
					<label className="label" id="event-name">
						<div>שם האירוע<br/>اسم الحدث</div>
						<input size="80" type="text" name="title" value={this.state.title} onChange={this.handleInputChange.bind(this)}/>
					</label>
					<label className="label" id="event-date">
						<div>תאריך<br/>التاريخ</div>
						<input size="80" dir="ltr" type="text" name="date" value={this.state.date} onChange={this.handleInputChange.bind(this)} placeholder="DD.MM.YYYY"/>
					</label>
					<label className="label" id="event-cat">
						<div>קטגוריה<br/>קטגוריה</div>
						<select dir="rtl" name="category" value={this.state.category} onChange={this.handleInputChange.bind(this)}>
							{
								categories.map((cat)=>{
									return <option key={"cat_" + cat._id} value={cat._id}>{cat.name.he}</option>
								})
							}
						</select>
					</label>
				</div>
			</div>
		</div>
	)
}

}

