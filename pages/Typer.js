import React from 'react';
import Meta from '../lib/meta';
import server from '../services/server';
import HeaderBar from './typer/HeaderBar'
import TypedActivistsTable from './typer/TypedActivistsTable'
import ContactScanDisplay from './typer/ContactScanDisplay'
import FieldValidation from './typer/FieldValidation'
import Popup from '../UIComponents/Popup/Popup';
import style from './typer/Typer.css'



export default class Typer extends React.Component {
	//constants
	scanPingIntervalDuration = 10000;

	constructor(props) {
		super(props);
		this.state = {
			activists:[],
			profileFields: [
				{
					name: "firstName", type: "text", ar: "الاسم الشخصي", he: "שם פרטי",
					validation: /^null|^.{2,}$/
				},
				{
					name: "lastName", type: "text", ar: "اسم العائلة", he: "שם משפחה",
					validation: /^null|^.{2,}$/
				},
				{
					name: "phone", type: "tel", ar: "البلد", he: "עיר",
					validation: /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,}$/
				},
				{
					name: "residency", type: "select", ar: "رقم الهاتف", he: "טלפון",
					validation: /^null|^.{2,}$/
				},
				{
					name: "email", type: "email", ar: "البريد الإلكتروني", he: "אימייל",
					validation: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				},
			],
			cells: [],
			selectedRowIndex: 0,
			scanId: null,
			scanUrl: null,
			fullyTyped: false,
			displayFullyTypedPopup: false,
			postAttempted: false, //toggled once the "post" button is pressed. If true, invalid fields will be highlighted
		};
	};
	componentDidMount() {
		this.setState({activists:[this.generateRow()]}, ()=>{this.getContactsScan();});
		FieldValidation.setFields(this.state.profileFields.slice());
	}
	getContactsScan() {
		server.get('contactScan', {})
		.then(json => {
			if(json.error)
			{
				if(json.error === "no pending scans are available")
					alert("אין דפי קשר שדורשים הקלדה במערכת. תוכלו להקליד פרטי פעילים בכל מקרה");
				return;
			}
			if(json.scanData)
			{
				const scanData = json.scanData;
				this.setState({"scanUrl":scanData.scanUrl, "cells":scanData.rows, "scanId":scanData._id});
				const callPingInterval = setInterval(this.pingScan.bind(this), this.scanPingIntervalDuration);
				// store interval promise in the state so it can be cancelled later:
				this.setState({callPingInterval: callPingInterval});
			}
			if(json.activists && json.activists.length)
			{
				const activists = json.activists.map((activist)=>{
					return this.generateRow(activist, true, true);
				});
				this.setState({"activists":activists});
			}
		});
	}
	pingScan(){
		if(!this.state.scanId)
			return;
		server.post('contactScan/pingScan', {
			'scanId':this.state.scanId
		})
		.then(json => {
		});
	}
	//this function generates a new row template
	generateRow = function(data = {}, locked = false, saved = false){
		let row = data;
		const fields = this.state.profileFields;
		for(let i = 0; i<fields.length; i++){
			row[fields[i].name] = data[fields[i].name] || "";
			row[fields[i].name + "Valid"] = saved;
		}
		row.scanRow = data["scanRow"] || 0;
		row.locked = locked;
		row.saved = saved;
		return row;
	}.bind(this);

	addRow = function() {
		let activists = this.state.activists.slice();
		const rows = activists.map(activist => activist.scanRow);
		//generally, the new row should correspond to the n[th] line of the scan, if there are already n-1 rows
		let nextScanRow = rows.length;
		for(let i=0; i < rows.length; i++){
			//however, if we skipped some scanned line, which can happen if we delete a row, we should add it in instead
			if(i < rows[i]){
				nextScanRow = i;
				break;
			}
		}
		//don't overflow the scanned rows
		if(this.state.cells.length && nextScanRow >= this.state.cells.length){
			return;
		}
		activists.push(this.generateRow({scanRow: nextScanRow}));
		//if a row was added in the middle, sort it into position
		activists.sort((a, b)=>(a.scanRow - b.scanRow));
		//assignment into state is done in two explicit stages, in order to keep the focus on the correct row
		//it still doesn't work most of the time
		//not important enough to find a fix, though
		this.setState({activists: activists}, ()=>{this.setState({selectedRowIndex:nextScanRow})});
	}.bind(this);
	
	handleRowFocus = function(rowIndex) {
		this.setState({selectedRowIndex: rowIndex});
	}.bind(this);
	
	handleTypedInput = function (name, value, rowIndex){
		let activists = this.state.activists.slice();
		activists[rowIndex][name] = value;
        FieldValidation.validate(activists, rowIndex, name);
		this.setState({activists: activists});
	}.bind(this);
	
	selectScanRow = function(index){
		if(index>=this.state.activists.length){
			this.addRow();
		}
		else{
			this.setState({selectedRowIndex: index});
		}
	}.bind(this);
	
	handleRowPost = function(rowIndex){
		let activists = this.state.activists.slice();
		if(rowIndex === activists.length-1)
			this.addRow();
		else
		{
			this.setState({selectedRowIndex:rowIndex+1});
		}
	}.bind(this);

	handleRowDeletion = function(index){
		let activists = this.state.activists.slice();
		//remove the appropriate row from the activists array
		activists.splice(Number(index), 1);
		//decrease selected row index if necessary
		let selectedRowIndex = this.state.selectedRowIndex;
		if(selectedRowIndex >= index){
			selectedRowIndex = selectedRowIndex === 0 ? selectedRowIndex : (selectedRowIndex-1);
		}
		//if no rows are left, create a new one
		if(!activists.length) {
			activists = [this.state.generateRow()];
		}
		//commit to state
		this.setState({activists: activists, selectedRowIndex:selectedRowIndex});
	}.bind(this);

	handleRowEditToggle = function(index){
		let activists = this.state.activists.slice();
		activists[index].locked = !activists[index].locked;
		this.setState({activists: activists});
	}.bind(this);

	checkFullyTyped = function(){
		const checkNeeded = this.state.scanId && this.state.cells.length===0;
		if(checkNeeded){
			this.setState({displayFullyTypedPopup: true});
		}
		else{
			this.handlePost();
		}
	}.bind(this);

	setFullyTyped = function(isFullyTyped){
		this.setState({fullyTyped: isFullyTyped}, () => {
			this.handlePost();
		})
	}.bind(this);

	handlePost=function(){
		const activists = this.state.activists.slice();
		if(!FieldValidation.validateAll(activists, this.state.profileFields)){
			this.setState({postAttempted: true});
			return;
		}
		const data ={
			"activists": activists,
			"scanId": this.state.scanId,
			"markedDone": this.state.fullyTyped
		};
		server.post('activists/uploadTyped', data)
		.then(() => {
			this.setState({
				activists: [this.generateRow()],
				cells: [],
				selectedRowIndex: 0,
				scanId: null,
				scanUrl: null,
				fullyTyped: false,
				displayFullyTypedPopup: false,
				postAttempted: false
			});
			alert("the details have been stored in the system");
			this.getContactsScan();
		});
	}.bind(this);
	
	render() {
		const cells = this.state.cells;
		const scanUrl = this.state.scanUrl;
		const selectedRowIndex = this.state.selectedRowIndex;
		const activists = this.state.activists;
		const selectedScanRow = activists.length?activists[selectedRowIndex].scanRow:0;
		const scanDisplay = <ContactScanDisplay
			cells={cells}
			scanUrl={scanUrl}
			selectedRow={selectedScanRow}
			selectScanRow={this.selectScanRow}/>;
		const toggleFullyTypedPopup =
				<Popup visibility={this.state.displayFullyTypedPopup} toggleVisibility={()=>{this.setState({displayFullyTypedPopup: !this.state.displayFullyTypedPopup})}}>
					<div className="fully-typed-popup-label">
						<div>האם סיימת להקליד את כל הרשומות בדף?</div>
						<div>האם סיימת להקליד את כל הרשומות בדף?</div>
					</div>
					<div className="confirm-fully-typed-wrap">
						<button className="confirm-fully-typed" onClick={()=>{this.setFullyTyped(true)}}>סיימתי</button>
						<button className="confirm-fully-typed" onClick={()=>{this.setFullyTyped(false)}}>נותרו רשומות להקלדה</button>
					</div>
				</Popup>;
		return (
			<div dir="rtl">
				<Meta/>
				<style jsx global>{style}</style>
				<HeaderBar sendFunction={this.checkFullyTyped}> </HeaderBar>
				<section className="section">
					<div className="main-panel">
					{scanUrl?scanDisplay:""}
						<content className="content">
							<TypedActivistsTable
								fields={this.state.profileFields}
								handleChange={this.handleTypedInput}
								handleRowPost={this.handleRowPost}
								handleRowFocus={this.handleRowFocus}
								handleRowDeletion={this.handleRowDeletion}
								handleRowEditToggle={this.handleRowEditToggle}
								activists={activists}
								selectedRow={selectedRowIndex}
								highlightInvalidFields={this.state.postAttempted}/>
						</content>
						{toggleFullyTypedPopup}
					</div>
				</section>
			</div>
		)
	}
}

