import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Meta from '../lib/meta';
import Stylesheet from './eventCreation/EventCreation.css'

import TopNavBar from './organizer/TopNavbar'

import ItemService from '../services/ItemService'
import server from '../services/server';

export default class EventCreation extends React.Component {
constructor(props) {
	super(props);
	const today = new Date();
	this.state = {
		title: "",
		date: today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear(),
		question1: "",
		text1: "",
		question2: "",
		text2: "",
		callScript: ""
	};
}
handleInputChange(event) {
	const target = event.target;
	const value = target.type === 'checkbox' ? target.checked : target.value;
	const name = target.name;
	this.setState({
		[name]: value
	});
}
handlePost() {
	let eventObject = {
		"name": this.state.title,
		"date": this.state.date,
		"callInstructions": {
			"text1": this.state.text1,
			"text2": this.state.text2,
			"question1": this.state.question1,
			"question2": this.state.question2,
			"script": this.state.callScript
		}
	};
	server.post('events', {'event':eventObject});
}

render() {
	return (
		<div style={{'height':'100vh'}}>
			<Meta/>
			<style jsx global>{Stylesheet}</style>
			<TopNavBar savedViews={[{'name':'New Activists'}, {'name':'Callers in Haifa'}]}></TopNavBar>
			<div dir="rtl" className="page-wrap">
				<div className="event-details-wrap">
					<div className="inputGroup event-identification">
						<label className="inline-label" id="event-name">
							<div>שם האירוע<br/>שם האירוע</div>
							<input type="text" name="title" value={this.state.title} onChange={this.handleInputChange.bind(this)}/>
							</label>
						<label className="inline-label" id="event-date">
							<div>תאריך<br/>תאריך</div>
							<input dir="ltr" type="text" name="date" value={this.state.date} onChange={this.handleInputChange.bind(this)} placeholder="DD.MM.YYYY"/>
						</label>
					</div>
					<br/>
					<label className="inline-label event-question">
						<div>שאלה 1<br/>שאלה 1</div>
						<textarea name="question1" value={this.state.question1} onChange={this.handleInputChange.bind(this)}></textarea>
					</label>
					<br/>
					<label className="event-text">
						<div>טקסט 1<br/>טקסט 1</div>
						<textarea name="text1" value={this.state.text1} onChange={this.handleInputChange.bind(this)}></textarea>
					</label>
					<br/>
					<label className="inline-label event-question">
						<div>שאלה 2<br/>שאלה 2</div>
						<textarea name="question2" value={this.state.question2} onChange={this.handleInputChange.bind(this)}></textarea>
					</label>
					<br/>
					<label className="event-text">
						<div>טקסט 2<br/>טקסט 2</div>
						<textarea name="text2" value={this.state.text2} onChange={this.handleInputChange.bind(this)}></textarea>
					</label>
				</div>
				<div className="event-script-wrap">
					<label>
						<div>תסריט שיחה<br/>תסריט שיחה</div>
						<textarea name="callScript" value={this.state.callScript} onChange={this.handleInputChange.bind(this)}></textarea>
					</label>
				</div>
			</div>
			<br/>
			<button onClick={this.handlePost.bind(this)}>שמירת אירוע</button>
		</div>
	)
}

}

