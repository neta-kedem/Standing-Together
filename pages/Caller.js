import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Meta from '../lib/meta';
import styles from './caller/Caller.css'

import server from '../services/server'

import Nav from './caller/Nav'
import SelectableRow from './caller/SelectableRow'
import Toggle from './caller/Toggle'
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
        activits:
            [{
                "fname": "שמעון",
                "lname": "לוי",
                "settlement": "חיפה",
                "phone": "0526358655"
              },
              {
                "fname": "ישראל",
                "lname": "ישראלי",
                "settlement": "תל-אביב",
                "phone": "0540000000"
              },
              {
                "fname": "ישראל",
                "lname": "ישראלי",
                "settlement": "תל-אביב",
                "phone": "0541111111"
              },
              {
                "fname": "ישראל",
                "lname": "ישראלי",
                "settlement": "תל-אביב",
                "phone": "0542222222"
              },
              {
                "fname": "ישראל",
                "lname": "ישראלי",
                "settlement": "תל-אביב",
                "phone": "0543333333"
              }],
        selectedRowArr : {0:1,1:0,2:0,3:0,4:0},
        selectedRow : 0,
        header:[
            {title: "טלפון",  visibility: true, key: "phone", icon:"phone", type:"text"},
            {title: "יישוב",  visibility: true, key: "city", icon:"building", type:"text"},
            {title: "שם משפחה", visibility: true, key: "lname", icon:"user", type:"text"},
            {title: "שם פרטי", visibility: true, key: "name", icon:"user", type:"text"}
            
        ]
      }
      this.handleSelection = this.handleSelection.bind(this);
      this.selectedName = this.selectedName.bind(this);
	  this.getEventDetails();
    }
    handleSelection(i){
        let arr = this.state.selectedRowArr;
        arr[this.state.selectedRow] = 0;
        arr[i] = 1;
        this.setState((props) => ({selectedRowArr: arr , selectedRow : i}));
    }
    selectedName(){
        var name = (this.state.activits[this.state.selectedRow]).fname;
        return name;
    }
	getEventDetails(){
		server.post('events/eventByCode', {'eventCode':this.state.eventCode})
			.then(json => {
				this.setState({'eventData': json});
		});
    }
    handleToggle(value){
        value = !(value);
        return value;
 
    }

render() {
    const tableHeader = 
			<tr style={styles['list-table-header']}>
				<th style={styles['list-row-selection-indicator']}> </th>
				{this.state.header.map((field, i) =>
				<th key={i} style={{...styles['list-table-header-field'], ...(!field.visibility?{'display':'none'}:'')}}>
                    {field.title+" "}
                    {field.icon!=""?<FontAwesomeIcon icon={field.icon}></FontAwesomeIcon>:''}
				</th>)}
      </tr>;
  let selectedName = (this.state.activits[this.state.selectedRow]).fname;
	return (
		<div style={{'height':'100vh','fontWeight':'540','overflowX':"hidden"}}>{/*,"fontFamily": "'Rubik (Hebrew)','Cairo (Arabic)', sans-serif"*/}
            <style jsx global>{`
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
			<Nav name={(this.state.activits[this.state.selectedRow]).fname} lname={(this.state.activits[this.state.selectedRow]).lname} phone={(this.state.activits[this.state.selectedRow]).phone} ></Nav>
            <div style={styles['right-panel']}>
                  <Thead style={{...styles['row'],...styles['info_table']}}></Thead >
                  <table>
                     {/*<thead style={{...styles['row'],...styles['info_table']}}>
                         {tableHeader}
                </thead>*/}
                     <tbody style={styles['row1']}>
                     {
                       this.state.activits.map((person, i) =>
                         <SelectableRow key={i} data={person} num={i} selected = {this.state.selectedRowArr[i]}
                         onSelect ={this.handleSelection.bind(this,i)}/>)}
                     </tbody>
                  </table>
                  <div style = {styles['chevron-style']}>
                   <div style = {styles['words']}>
                      עוד שמות <br/>
                      المزيد من الاسماء&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     </div>
                     <FontAwesomeIcon icon="chevron-circle-down" style = {styles['chevron-icon']}/>
                  </div>
                  <div style = {{...styles['query'],...styles['space']}}>
                  העתק טקסט &nbsp; <FontAwesomeIcon icon="copy"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Toggle value={true} handleChange={this.handleToggle.bind(this)}/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; 
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; מסכימ/ה להגיע להפגנה 
                  </div>
        
                  <div style = {styles['query']}>
                  העתק טקסט &nbsp; <FontAwesomeIcon icon="copy"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Toggle/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; 
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; מסכימ/ה לתרום לתנועה 
                  </div>
                  <div style = {{...styles['query'],...styles['space']}}>
                      <div>
                     הסרה מהרשימה &nbsp; <FontAwesomeIcon icon="user-times" style = {styles['icons']}/><br/>
                     ازالة من القائمة&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     </div>
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     <div>
                     להתקשר בשעה &nbsp; <FontAwesomeIcon icon="clock" style = {styles['icons']}/><br/>
                     الاتصال في الساعة&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     </div>
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     <div>
                     לא עונים &nbsp; <FontAwesomeIcon icon="microphone-slash" style = {styles['icons']}/><br/>
                     لا بجيب&nbsp;&nbsp;&nbsp;&nbsp;
                     </div>
                     
                  </div>
            </div>
            <div style={styles['left-panel']}>
              <textarea style={styles['talking-scenario']} value={this.state.eventData.callInstructions.script}>
				  	  </textarea>
            </div>
		</div>
	)
}
}

