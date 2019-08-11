import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {CopyToClipboard} from 'react-copy-to-clipboard';

import server from '../services/server'

import './caller/Caller.scss'
import Nav from './caller/Nav'
import PrevCalls from './caller/PrevCalls'
import CallPostponer from './caller/CallPostponer'
import Popup from '../UIComponents/Popup/Popup'
import Confirmation from '../UIComponents/Effects/Confirmation/Confirmation'
import SelectableTable from '../UIComponents/SelectableTable/SelectableTable'
import Toggle from '../UIComponents/SelectableTable/FieldTypes/ToggleSwitch.js'
import {faChevronCircleLeft, faClock, faChevronCircleDown, faUser, faPhone, faEnvelopeOpen, faUserTimes, faCopy, faMicrophoneSlash} from '@fortawesome/free-solid-svg-icons'
library.add(faChevronCircleLeft, faClock, faChevronCircleDown, faUser, faPhone, faEnvelopeOpen, faUserTimes, faCopy, faMicrophoneSlash);

export default class Caller extends React.Component {
	//constants
	callPingIntervalDuration = 10000;
	constructor(props) {
		super(props);
		this.state = {
			eventCode: props.url?props.url.query.eventCode:"",
			eventData: {
				callInstructions:{},
				eventDetails:{}
			},
			activists:[],
			header:[
				{title: ["الاسم الشخصي", "שם פרטי"], visibility: true, key: "firstName", icon:"", type:"text", width:"25%"},
				{title: ["اسم العائلة", "שם משפחה"], visibility: true, key: "lastName", icon:"", type:"text", width:"25%"},
				{title: ["رقم الهاتف", "טלפון"],  visibility: true, key: "phone", icon:"", type:"text", width:"25%"},
				{title: ["البلد", "יישוב"],  visibility: true, key: "city", icon:"", type:"text", width:"25%"}
			],
			fetchErrors:{
				"No Invites": {"ar":"אין הזמנות לאירוע הזה", "he":"אין הזמנות לאירוע הזה"},
				"All Resolved": {"ar":"כל ההזמנות בוצעו", "he":"כל ההזמנות בוצעו"},
				"All Processed": {"ar":"כל ההזמנות בטיפול - בדקו שוב מאוחר יותר", "he":"כל ההזמנות בטיפול - בדקו שוב מאוחר יותר"},
				"def": {"ar":"שגיאה כלשהי", "he":"שגיאה כלשהי"}
			},
			selectedRow:{},
			fetchActivistsMessagePopup: false,
			fetchActivistsMessage: "",
			effects:{Confirmation:false}
		};
		this.handleSelection = this.handleSelection.bind(this);
	}
	componentDidMount() {
		this.getEventDetails();
		const callPingInterval = setInterval(this.pingCalls.bind(this), this.callPingIntervalDuration);
		// store interval promise in the state so it can be cancelled later:
		this.setState({callPingInterval: callPingInterval});
	}

	componentWillUnmount() {
		clearInterval(this.state.callPingInterval);
	}

	getEventDetails(){
		server.get('events/eventByCode/'+this.state.eventCode, {'eventCode':this.state.eventCode})
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
		server.get('call/fetchActivistsToCall/'+this.state.eventData._id, {'eventId':this.state.eventData._id})
			.then(json => {
				if(json.error)
				{
					return;
				}
				//if the fetch attempt returned a message instead of an activists list, display that message
				if(json.message)
				{
					this.setState({'fetchActivistsMessage': json.message, 'fetchActivistsMessagePopup': true});
					return;
				}
				else{
					this.setState({'fetchActivistsMessage': "", 'fetchActivistsMessagePopup': false});
				}
				let activists = json;
				for(let i = 0; i<activists.length; i++)
				{
					activists[i].contributed = false;
					activists[i].attendingEvent = false;
					if(activists[i].lastCallAt){
						activists[i].lastCallAt = new Date(activists[i].lastCallAt);
					}
					if(activists[i].availableAt){
						let availabilityDate = new Date(activists[i].availableAt);
						activists[i].availableAt = availabilityDate.getHours()+":"+availabilityDate.getMinutes();
					}
				}
				this.setState({'activists': this.state.activists.slice().concat(activists)});
		});
	}
	handleFetchActivistsMessagePopupToggle(){
		this.setState({
			'fetchActivistsMessagePopup': !this.state.fetchActivistsMessagePopup
		});
	}

	effectHandler(name) {
		const effects = this.state.effects;
		effects[name] = !effects[name];
		this.setState({effects: effects});
	}

    handleSelection(i){
        this.setState(() => ({selectedRowIndex : i}));
    }
	
    toggleAttendance(value){
		if(!this.state.activists[this.state.selectedRowIndex])
			return;
        const activists = this.state.activists.slice();
		activists[this.state.selectedRowIndex].attendingEvent=value;
        this.setState(() => ({activists : activists}));
    }
	
	toggleContribution(value){
		if(!this.state.activists[this.state.selectedRowIndex])
			return;
        const activists = this.state.activists.slice();
		activists[this.state.selectedRowIndex].contributed=value;
        this.setState(() => ({activists : activists}));
    }
	
	resolveCall(){
		if(!this.state.activists[this.state.selectedRowIndex])
			return;
		const activists = this.state.activists.slice();
		const activist = activists[this.state.selectedRowIndex];
		activists[this.state.selectedRowIndex].lastCallAt = new Date();
		activists[this.state.selectedRowIndex].callCount += 1;
		activists.splice(this.state.selectedRowIndex, 1);
		this.setState({activists : activists});
		server.post('call/resolveCall', {
			'eventId':this.state.eventData._id,
			'activistId': activist._id,
			'contributed': activist.contributed,
			'attendingEvent': activist.attendingEvent,
		})
		.then(() => {
			this.effectHandler("Confirmation");
		});
	}
	updateActivistAvailability(val){
		//indicate the the activist will be available at [val] o'clock
		const activists = this.state.activists.slice();
		activists[this.state.selectedRowIndex].availableAt = val;
		activists[this.state.selectedRowIndex].lastCallAt = new Date();
		activists[this.state.selectedRowIndex].callCount += 1;
		const activist = activists[this.state.selectedRowIndex];
		activists.splice(this.state.selectedRowIndex, 1);
		this.setState({activists : activists});
		server.post('call/postponeCall', {
			'eventId': this.state.eventData._id,
			'activistId': activist._id,
			'availableAt': val
		})
		.then(() => {
			this.effectHandler("Confirmation");
		});
	}
	markUnanswered(){
		//indicate the the activist will be available at [val] o'clock
		const activists = this.state.activists.slice();
		activists[this.state.selectedRowIndex].lastCallAt = new Date();
		activists[this.state.selectedRowIndex].callCount += 1;
		const activist = activists[this.state.selectedRowIndex];
		activists.splice(this.state.selectedRowIndex, 1);
		this.setState({activists : activists});
		server.post('call/markUnanswered', {
			'eventId': this.state.eventData._id,
			'activistId': activist._id
		})
			.then(() => {
				this.effectHandler("Confirmation");
			});
	}
	pingCalls(){
		//if there are no activists in the to-call list, return without doing anything
		if(this.state.activists.length === 0)
			return;
		server.post('call/pingCalls', {
			'eventId':this.state.eventData._id,
			'activistIds': this.state.activists.map(function(value) {return value["_id"];})
		})
		.then(json => {
		});
	}
	render() {
		const i = this.state.selectedRowIndex;
		const isSelected = i !== undefined;
		const selectedActivist = this.state.activists[i]?this.state.activists[i]:{};
		let lastCallTime = "";
		if(selectedActivist.lastCallAt)
		{
			try {
				const minutes = ("0" + selectedActivist.lastCallAt.getMinutes()).slice(-2);
				const hours = ("0" + selectedActivist.lastCallAt.getHours()).slice(-2);
				lastCallTime = hours+":"+minutes;
			}
			catch(err) {
				lastCallTime = selectedActivist.lastCallAt;
			}
		}
		const messageErrors = this.state.fetchErrors;
		const messageCode = this.state.fetchActivistsMessage;
		const fetchErrorMessage = messageErrors[messageCode]?messageErrors[messageCode]:messageErrors["def"];
		const fetchErrorPopup = <Popup visibility={this.state.fetchActivistsMessagePopup}
									   toggleVisibility={this.handleFetchActivistsMessagePopupToggle.bind(this)}>
			<div className="error-message">
				<div>{fetchErrorMessage.ar}</div>
				<div>{fetchErrorMessage.he}</div>
			</div>
			<div className="error-message-try-again" onClick={this.getActivistsToCall.bind(this)}>
				<div>בדיקה מחדש</div>
				<div>בדיקה מחדש</div>
			</div>
		</Popup>;
		const confirmationEffect = <Confirmation toggleVisibility={()=>{this.effectHandler("Confirmation")}} visible={this.state.effects.Confirmation}/>;
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
						ازالة من القائمة
						<br/>
						הסרה מהרשימה
					</div>
				</div>
				<div className="call-outcome-button">
					<FontAwesomeIcon icon="clock" className="label-icon"/>
					<div className="label-text">
						الاتصال في الساعة
						<br/>
						להתקשר בשעה
					</div>
					<div>
						<CallPostponer value={selectedActivist.availableAt} handlePost={this.updateActivistAvailability.bind(this)}/>
					</div>
				</div>
				<div className="call-outcome-button">
					<div className="label-text unanswered-call" onClick={this.markUnanswered.bind(this)}>
						<FontAwesomeIcon icon="microphone-slash" className="label-icon"/>
						لا بجيب
						<br/>
						לא עונים
					</div>
					<div className="label-text">
						שיחה אחרונה ב-{lastCallTime}
						<br/>
						שיחה אחרונה ב-{lastCallTime}
					</div>
				</div>
				<div className="call-outcome-button finish-call" onClick={this.resolveCall.bind(this)}>
					<FontAwesomeIcon icon="chevron-circle-left" className="label-icon"/>
					<div className="label-text">
						نهاية المكالمة
						<br/>
						סיום שיחה
					</div>
				</div>
			</div>
		</div>;
		return (
			<div style={{'height':'100vh','fontWeight':'540','overflowX':"hidden"}} dir="rtl" className={"page-wrap-caller"}>
				<Nav name={selectedActivist.firstName} lname={selectedActivist.lastName} phone={selectedActivist.phone} event={this.state.eventData.eventDetails.name}/>
				<PrevCalls callCount={selectedActivist.callCount} lastCallAt={selectedActivist.lastCallAt} availableAt={selectedActivist.availableAt}/>
				<div className="content-wrap">
					<div className="right-panel">
						<SelectableTable onSelect={this.handleSelection} rows={this.state.activists} header={this.state.header} singleSelection={true} rowKey={"_id"}>
						</SelectableTable>
						<div className="fetch-more-button inline-label" onClick={this.getActivistsToCall.bind(this)}>
							<div className="label-text">
								<div>المزيد من الاسماء</div>
								<div>עוד שמות</div>
							</div>
							<div className="label-icon"><FontAwesomeIcon icon="chevron-circle-down"/></div>
						</div>
						{isSelected?actionOptions:''}
					</div>
					<div className="left-panel">
						<div className="script-title">
							<div>תסריט שיחה:</div>
							<div>תסריט שיחה:</div>
						</div>
						<textarea value={this.state.eventData.callInstructions.script}>
						</textarea>
					</div>
					{fetchErrorPopup}
					{confirmationEffect}
				</div>
			</div>
		);
	}
}
