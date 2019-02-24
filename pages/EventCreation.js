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
		question1: "",
		text1: "",
		question2: "",
		text2: "",
		callScript: ""
	};
	if(this.state["_id"]){
		this.fetchEventDetails();
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
				question1: event.callInstructions.question1,
				text1: event.callInstructions.text1,
				question2: event.callInstructions.question2,
				text2: event.callInstructions.text2,
				callScript: event.callInstructions.script,
			});
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
	if(!this.state.callScript.length)
	{
		alert("please provide a script for the event");
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
		},
		"callInstructions": {
			"text1": this.state.text1,
			"text2": this.state.text2,
			"question1": this.state.question1,
			"question2": this.state.question2,
			"script": this.state.callScript
		}
	};
	server.post('events', {'event':eventObject})
	.then(() => {
		alert("saved");
		Router.push({pathname: '/Organizer'}).then(()=>{});
	});
}

render() {
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
					<div className="inputGroup event-identification">
						<label className="inline-label" id="event-name">
							<div>שם האירוע<br/>اسم الحدث</div>
							<input type="text" name="title" value={this.state.title} onChange={this.handleInputChange.bind(this)}/>
							</label>
						<label className="inline-label" id="event-date">
							<div>תאריך<br/>التاريخ</div>
							<input dir="ltr" type="text" name="date" value={this.state.date} onChange={this.handleInputChange.bind(this)} placeholder="DD.MM.YYYY"/>
						</label>
					</div>
					<label className="inline-label event-question">
						<div>שאלה 1<br/>سؤال 1</div>
						<textarea name="question1" value={this.state.question1} maxLength="50" onChange={this.handleInputChange.bind(this)}> </textarea>
					</label>
					<label className="event-text">
						<div>טקסט 1<br/>نص 1</div>
						<textarea name="text1" value={this.state.text1} onChange={this.handleInputChange.bind(this)}> </textarea>
					</label>
					<label className="inline-label event-question">
						<div>שאלה 2<br/>سؤال 2</div>
						<textarea name="question2" value={this.state.question2} maxLength="50" onChange={this.handleInputChange.bind(this)}> </textarea>
					</label>
					<label className="event-text">
						<div>טקסט 2<br/>نص 2</div>
						<textarea name="text2" value={this.state.text2} onChange={this.handleInputChange.bind(this)}> </textarea>
					</label>
				</div>
				<div className="event-script-wrap">
					<label>
						<div>תסריט שיחה<br/>سيناريو الحوار</div>
						<textarea name="callScript" value={this.state.callScript} onChange={this.handleInputChange.bind(this)}> </textarea>
					</label>
				</div>
			</div>
		</div>
	)
}

}

