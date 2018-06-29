import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Meta from '../lib/meta';
import styles from './caller/Caller.css'

import server from '../services/server'

import Nav from './caller/Nav'
import SelectableTable from '../UIComponents/SelectableTable/SelectableTable'
import ToggleSwitch from '../UIComponents/SelectableTable/FieldTypes/ToggleSwitch.js'
import Thead from './caller/Thead.js'
import ItemService from '../services/ItemService'
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
		activists:
			[{
				"fname": "שמעון",
				"lname": "לוי",
				"city": "חיפה",
				"phone": "0526358655"
			},
			{
				"fname": "ישראל",
				"lname": "ישראלי",
				"city": "תל-אביב",
				"phone": "0540000000"
			},
			{
				"fname": "ישראל",
				"lname": "ישראלי",
				"city": "תל-אביב",
				"phone": "0541111111"
			},
			{
				"fname": "ישראל",
				"lname": "ישראלי",
				"city": "תל-אביב",
				"phone": "0542222222"
			},
			{
				"fname": "ישראל",
				"lname": "ישראלי",
				"city": "תל-אביב",
				"phone": "0543333333"
			}],
		header:[
			{title: "טלפון رقم الهاتف",  visibility: true, key: "phone", icon:"", type:"text"},
			{title: "יישוב البلد",  visibility: true, key: "city", icon:"", type:"text"},
			{title: "שם משפחה اسم العائلة", visibility: true, key: "lname", icon:"", type:"text"},
			{title: "שם פרטי الاسم الشخصي", visibility: true, key: "fname", icon:"", type:"text"}	
		]
	};
	this.getEventDetails();
}

getEventDetails(){
	server.post('events/eventByCode', {'eventCode':this.state.eventCode})
		.then(json => {
			this.setState({'eventData': json});
	});
}

render() {
		return (
			<div style={{'height':'100vh','fontWeight':'540','overflowX':"hidden"}}>
				<style jsx global>
				{`
					/* width */
					::-webkit-scrollbar {
						width: 5px;
					}
					
					/* Track */
					::-webkit-scrollbar-track {
						background: rgb(169,169,169); 
					}
					
					/* Handle */
					::-webkit-scrollbar-thumb {
						background:rgba(86, 95, 108, .9); 
					}
					
					/* Handle on hover */
					::-webkit-scrollbar-thumb:hover {
						background: rgba(86, 95, 108, .9); 
					}
	
					:lang(heb){
						font-family: 'Rubik', sans-serif;
					}
	
					:lang(ar){
						font-family: 'Cairo', sans-serif;
					}
				`}
				</style>
				<Meta/>
				{/*<Nav name={(this.state.activits[this.state.selectedRow]).fname} lname={(this.state.activits[this.state.selectedRow]).lname} phone={(this.state.activits[this.state.selectedRow]).phone} ></Nav>*/}
				<div style={styles['right-panel']} dir="rtl">
					<SelectableTable rows={this.state.activists} header={this.state.header} singleSelection={true}></SelectableTable>
					<ToggleSwitch/>
				</div>
				<div style={styles['left-panel']}>
					<textarea style={styles['talking-scenario']} value={this.state.eventData.callInstructions.script}>
					</textarea>
				</div>
			</div>
		)
	}
}