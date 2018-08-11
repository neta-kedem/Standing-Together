import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import TimeInput from 'react-time-input';
import Meta from '../lib/meta';

import server from '../services/server'

import style from './caller/Caller.css'
import Nav from './caller/Nav'
import SelectableTable from '../UIComponents/SelectableTable/SelectableTable'
import Toggle from '../UIComponents/SelectableTable/FieldTypes/ToggleSwitch.js'
import {faChevronCircleLeft, faClock, faChevronCircleDown, faUser, faPhone, faEnvelopeOpen, faUserTimes, faCopy, faMicrophoneSlash} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faChevronCircleLeft, faClock, faChevronCircleDown, faUser, faPhone, faEnvelopeOpen, faUserTimes, faCopy, faMicrophoneSlash);

export default class Caller extends React.Component {
	//constants
	callPingIntervalDuration = 10000;
	constructor(props) {
		super(props);
		this.state = {
			eventCode: props.url.query.eventCode,
			eventData: {
				callInstructions:{},
				eventDetails:{}
			},
			activists:[],
			header:[
				{title: ["שם פרטי الاسم الشخصي"], visibility: true, key: "firstName", icon:"", type:"text", width:"25%"},
				{title: ["שם משפחה اسم العائلة"], visibility: true, key: "lastName", icon:"", type:"text", width:"25%"},
				{title: ["טלפון رقم الهاتف"],  visibility: true, key: "phone", icon:"", type:"text", width:"25%"},
				{title: ["יישוב البلد"],  visibility: true, key: "city", icon:"", type:"text", width:"25%"}
			],
			selectedRow:{}
		};
		this.handleSelection = this.handleSelection.bind(this);
	}
	componentDidMount() {
		this.getEventDetails();
		var callPingInterval = setInterval(this.pingCalls.bind(this), this.callPingIntervalDuration);
		// store interval promise in the state so it can be cancelled later:
		this.setState({callPingInterval: callPingInterval});
	}

	componentWillUnmount() {
		clearInterval(this.state.callPingInterval);
	}

	getEventDetails(){
		server.post('events/eventByCode', {'eventCode':this.state.eventCode})
		.then(json => {
			if(json.error)
			{
				return;
			}
			this.setState({'eventData': json});
			this.getActivistsToCall();
		});
    }
	getActivistsToCall(){
		server.post('call/fetchActivistsToCall', {'eventId':this.state.eventData._id})
			.then(json => {
				if(json.error)
				{
					return;
				}
				let activists = json;
				for(var i = 0; i<activists.length; i++)
				{
					activists[i].contributed = false;
					activists[i].attendingEvent = false;
				}
				this.setState({'activists': this.state.activists.slice().concat(activists)});
		});
	}

    handleSelection(i){
        this.setState((props) => ({selectedRowIndex : i}));
    }
	
    toggleAttendance(value){
		if(!this.state.activists[this.state.selectedRowIndex])
			return;
        const activists = this.state.activists.slice();
		activists[this.state.selectedRowIndex].attendingEvent=value;
        this.setState((props) => ({activists : activists}));
    }
	
	toggleContribution(value){
		if(!this.state.activists[this.state.selectedRowIndex])
			return;
        const activists = this.state.activists.slice();
		activists[this.state.selectedRowIndex].contributed=value;
        this.setState((props) => ({activists : activists}));
    }
	
	resolveCall(){
		if(!this.state.activists[this.state.selectedRowIndex])
			return;
		const activists = this.state.activists.slice();
		const activist = activists[this.state.selectedRowIndex];
		activists[this.state.selectedRowIndex].lastCallAt = new Date();
		this.setState({activists : activists});
		server.post('call/resolveCall', {
			'eventId':this.state.eventData._id,
			'activistId': activist._id,
			'contributed': activist.contributed,
			'attendingEvent': activist.attendingEvent,
		})
		.then(json => {
		});
	}
	updateActivistAvailability(val){
		const activists = this.state.activists.slice();
		activists[this.state.selectedRowIndex].availableAt = val;
		activists[this.state.selectedRowIndex].lastCallAt = new Date();
		const activist = activists[this.state.selectedRowIndex];
		this.setState({activists : activists});
		server.post('call/postponeCall', {
			'eventId':this.state.eventData._id,
			'activistId': activist._id,
			'availableAt': val
		})
		.then(json => {
		});
	}
	pingCalls(){
		//if there are no activists in the to-call list, return without doing anything
		if(this.state.activists.length==0)
			return;
		server.post('call/pingCalls', {
			'eventId':this.state.eventData._id,
			'activistIds': this.state.activists.map(function(value,index) {return value["_id"];})
		})
		.then(json => {
		});
	}
	render() {
		const i = this.state.selectedRowIndex;
		const isSelected = i!=undefined;
		const selectedActivist = this.state.activists[i]?this.state.activists[i]:{};
		let lastCallTime = "";
		if(selectedActivist.lastCallAt)
		{
			const minutes = ("0" + selectedActivist.lastCallAt.getMinutes()).slice(-2);
			const hours = ("0" + selectedActivist.lastCallAt.getHours()).slice(-2);
			lastCallTime = hours+":"+minutes;
		}
		const actionOptions =
		<div>
			<div className="caller-action attendance-indication">
				<div className="caller-action-col call-question">{this.state.eventData.callInstructions.question1}</div>
				<div className="caller-action-col">
					<Toggle value={isSelected?selectedActivist["attendingEvent"]:false} handleChange={this.toggleAttendance.bind(this)}/>
				</div>
				<div className="copy-text-button caller-action-col">
					<CopyToClipboard text={this.state.eventData.callInstructions.text1} onCopy={()=>{alert("saved to clipboard!")}}>
						<div className="inline-label">
							<div className="label-text">העתק טקסט</div>
							<FontAwesomeIcon icon="copy" className="label-icon"/>
						</div>
					</CopyToClipboard>
				</div>
			</div>
			<div className="caller-action donation-indication">
				<div className="caller-action-col call-question">{this.state.eventData.callInstructions.question2}</div>
				<div className="caller-action-col">
					<Toggle value={isSelected?selectedActivist["contributed"]:false} handleChange={this.toggleContribution.bind(this)}/>
				</div>
				<div className="copy-text-button caller-action-col">
					<CopyToClipboard text={this.state.eventData.callInstructions.text2} onCopy={()=>{alert("saved to clipboard!")}}>
						<div className="inline-label">
							<div className="label-text">העתק טקסט</div>
							<FontAwesomeIcon icon="copy" className="label-icon"/>
						</div>
					</CopyToClipboard>
				</div>
			</div>
			<div className="call-outcomes">
				<div className="call-outcome-button remove-contact">
					<FontAwesomeIcon icon="user-times" className="label-icon"/>
					<div className="label-text">
						הסרה מהרשימה
						<br/>
						ازالة من القائمة
					</div>
				</div>
				<div className="call-outcome-button">
					<FontAwesomeIcon icon="clock" className="label-icon"/>
					<div className="label-text">
						להתקשר בשעה
						<br/>
						الاتصال في الساعة
					</div>
					<div>
						<TimeInput
							className="availability-timer"
							ref="TimeInputWrapper"
							mountFocus='true'
							onTimeChange={this.updateActivistAvailability.bind(this)}
						/>
					</div>
				</div>
				<div className="call-outcome-button">
					<FontAwesomeIcon icon="microphone-slash" className="label-icon"/>
					<div className="label-text">
						לא עונים
						<br/>
						لا بجيب
					</div>
					<div>
						שיחה אחרונה ב-{lastCallTime}
						<br/>
						שיחה אחרונה ב-{lastCallTime}
					</div>
				</div>
				<div className="call-outcome-button finish-call" onClick={this.resolveCall.bind(this)}>
					<FontAwesomeIcon icon="chevron-circle-left" className="label-icon"/>
					<div className="label-text">
						סיום שיחה
						<br/>
						סיום שיחה
					</div>
				</div>
			</div>
		</div>;
		return (
			<div style={{'height':'100vh','fontWeight':'540','overflowX':"hidden"}} dir="rtl">
				<style jsx global>{style}</style>
				<Meta/>
				<Nav name={selectedActivist.firstName} lname={selectedActivist.lastName} phone={selectedActivist.phone}/>
				<div className="content-wrap">
					<div className="right-panel">
						<SelectableTable onSelect={this.handleSelection} rows={this.state.activists} header={this.state.header} singleSelection={true}></SelectableTable>
						<div className="fetch-more-button inline-label" onClick={this.getActivistsToCall.bind(this)}>
							<div className="label-text">
								עוד שמות
								<br/>
								المزيد من الاسماء
							</div>
							<div className="label-icon"><FontAwesomeIcon icon="chevron-circle-down"/></div>
						</div>
						{isSelected?actionOptions:''}
					</div>
					<div className="left-panel">
						<div className="script-title">תסריט שיחה:</div>
						<textarea value={this.state.eventData.callInstructions.script}>
						</textarea>
					</div>
				</div>
			</div>
		);
	}
}
