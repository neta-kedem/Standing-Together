import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Meta from '../lib/meta';
import styles from './caller/Caller.css'

import Nav from './caller/Nav'
import SelectableRow from './caller/SelectableRow'

import ItemService from '../services/ItemService'
import {faPaperPlane, faCheckSquare, faUser, faPhone, faEnvelopeOpen, faCalendar, faCalendarCheck} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faPaperPlane, faCheckSquare, faUser, faPhone, faEnvelopeOpen, faCalendar, faCalendarCheck);

export default class Caller extends React.Component {
constructor(props) {
    super(props);
    this.state = {
        activits:
            [{
                "fname": "שמעון",
                "lname": "לוי",
                "settlement": "חיפה",
                "phone": "0526358655"
              },
              {
                "fname": "fname",
                "lname": "lname",
                "settlement": "city",
                "phone": "phone"
              },
              {
                "fname": "fname",
                "lname": "lname",
                "settlement": "city",
                "phone": "phone"
              },
              {
                "fname": "fname",
                "lname": "lname",
                "settlement": "city",
                "phone": "phone"
              },
              {
                "fname": "fname",
                "lname": "lname",
                "settlement": "city",
                "phone": "phone"
              }],
        selectedRowArr : {0:1,1:0,2:0,3:0,4:0},
        selectedRow : 0,
        header:[
            {title: "Phone",  visibility: true, key: "phone", icon:"phone", type:"text"},
            {title: "Lives In",  visibility: true, key: "city", icon:"building", type:"text"},
            {title: "Last Name", visibility: true, key: "lname", icon:"user", type:"text"},
            {title: "Name", visibility: true, key: "name", icon:"user", type:"text"}
            
        ]
      }
      this.handleSelection = this.handleSelection.bind(this);
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


render() {
    const tableHeader = 
			<tr style={styles['list-table-header']}>
				<th style={styles['list-row-selection-indicator']}> </th>
				{this.state.header.map((field, i) =>
				<th key={i} style={{...styles['list-table-header-field'], ...(!field.visibility?{'display':'none'}:'')}}>
					{field.icon!=""?<FontAwesomeIcon icon={field.icon}></FontAwesomeIcon>:''}
					{" "+field.title}
				</th>)}
            </tr>;
    let selectedName = (this.state.activits[this.state.selectedRow]).fname;
	return (
		<div style={{'height':'100vh'}}>
			<Meta/>
			<Nav savedViews={[{'name': selectedName}, {'name':'מתקשר לישראל ישראלי בטלפון 054-0000000 בקשר להפגנה בשבת'}]}></Nav>
            <div style={styles['left-panel']}>
            <table>
                     <thead style={{...styles['row'],...styles['info_table']}}>
                         {tableHeader}
                     </thead>
                     <tbody style={styles['row1']}>
                     {
                       this.state.activits.map((person, i) =>
                         <SelectableRow key={i} data={person} num={i} selected = {this.state.selectedRowArr[i]}
                         onSelect ={this.handleSelection.bind(this,i)}/>)}
                     </tbody>
                  </table>
            </div>
		</div>
	)
}

}

