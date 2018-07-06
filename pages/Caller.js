import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Meta from '../lib/meta';

import server from '../services/server'

import style from './caller/Caller.css'
import Nav from './caller/Nav'
import SelectableTable from '../UIComponents/SelectableTable/SelectableTable'
import Toggle from '../UIComponents/SelectableTable/FieldTypes/ToggleSwitch.js'
import {faClock, faChevronCircleDown, faUser, faPhone, faEnvelopeOpen, faUserTimes, faCopy, faMicrophoneSlash} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faClock, faChevronCircleDown, faUser, faPhone, faEnvelopeOpen, faUserTimes, faCopy, faMicrophoneSlash);

export default class Caller extends React.Component {
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
				{title: "טלפון رقم الهاتف",  visibility: true, key: "phone", icon:"", type:"text"},
				{title: "יישוב البلد",  visibility: true, key: "city", icon:"", type:"text"},
				{title: "שם משפחה اسم العائلة", visibility: true, key: "lastName", icon:"", type:"text"},
				{title: "שם פרטי الاسم الشخصي", visibility: true, key: "firstName", icon:"", type:"text"}	
			],
			selectedRow:{}
		};
		this.handleSelection = this.handleSelection.bind(this);
		this.getEventDetails();
		this.getActivistsToCall();
	}

	getEventDetails(){
		server.post('events/eventByCode', {'eventCode':this.state.eventCode})
			.then(json => {
				if(json.error)
				{
					return;
				}
				this.setState({'eventData': json});
		});
    }
	getActivistsToCall(){
		server.post('call/fetchActivistsToCall', {'eventCode':this.state.eventCode})
			.then(json => {
				if(json.error)
				{
					alert(json.error);
					return;
				}
				let activists = json;
				for(var i = 0; i<activists.length; i++)
				{
					activists[i].contributed = false;
					activists[i].attendingEvent = false;
				}
				this.setState({'activists': activists});
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
		if(!this.state.selectedRowIndex)
			return;
        const activists = this.state.activists.slice();
		activists[this.state.selectedRowIndex].contributed=value;
        this.setState((props) => ({activists : activists}));
    }
	render() {
		const i = this.state.selectedRowIndex;
		const isSelected = i!=undefined;
		const selectedActivist = this.state.activists[i]?this.state.activists[i]:{};
		const actionOptions =
		<div>
			<div className="caller-action attendance-indication">
				<div className="copy-text-button caller-action-col">
					<div className="label-text">העתק טקסט</div>
					<FontAwesomeIcon icon="copy" className="label-icon"/>
				</div>
				<div className="caller-action-col">
					<Toggle value={isSelected?selectedActivist["attendingEvent"]:false} handleChange={this.toggleAttendance.bind(this)}/>
				</div>
				<div className="caller-action-col">מסכימ/ה להגיע להפגנה</div>
			</div>
			<div className="caller-action donation-indication">
				<div className="copy-text-button caller-action-col">
					<div className="label-text">העתק טקסט</div>
					<FontAwesomeIcon icon="copy" className="label-icon"/>
				</div>
				<div className="caller-action-col">
					<Toggle value={isSelected?selectedActivist["contributed"]:false} handleChange={this.toggleContribution.bind(this)}/>
				</div>
				<div className="caller-action-col">מסכימ/ה לתרום לתנועה</div>
			</div>
			<div className="call-outcomes">
				<div className="call-outcome-button">
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
				</div>
				<div className="call-outcome-button">
					<FontAwesomeIcon icon="microphone-slash" className="label-icon"/>
					<div className="label-text">
						לא עונים
						<br/>
						لا بجيب
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
						<div className="caller-action fetch-more-button">
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
