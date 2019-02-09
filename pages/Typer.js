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
			activists:[{
				firstName:"", lastName:"", phone:"", residency:"", email:"",
				firstNameValid:false, lastNameValid:false, phoneValid:false, residencyValid:false, emailValid:false,
				scanRow:0}],
			cells: [],
			selectedRowIndex: 0,
			scanId: null,
			scanUrl: null,
			fullyTyped: false,
			displayFullyTypedPopup: false,
			postAttempted: false //toggled once the "post" button is pressed. If true, invalid fields will be highlighted
		}
	};
	componentDidMount() {
		this.getContactsScan();
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
				const activists = json.activists;
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
	
	addRow=function() {
		let activists = this.state.activists.slice();
		const rows = activists.map(activist => activist.scanRow);
		//generally, the new row should correspond to the n[th] line of the scan, if there are already n-1 rows
		let nextScanRow = rows.length;
		for(let i=0; i< rows.length; i++){
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
		activists.push({
			firstName:"", lastName:"", phone:"", residency:"", email:"",
			firstNameValid:false, lastNameValid:false, phoneValid:false, residencyValid:false, emailValid:false,
			scanRow:nextScanRow});
		//if a row was added in the middle, sort it into position
		activists.sort((a, b)=>(a.scanRow - b.scanRow));
		this.setState({activists: activists, selectedRowIndex:nextScanRow});
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

	handleRowDeletion=function(index){
		let activists = this.state.activists.slice();
		//remove the appropriate row from the activists array
		activists.splice(Number(index), 1);
		//decrease selected row index if necessary
		let selectedRowIndex = this.state.selectedRowIndex;
		if(selectedRowIndex >= index){
			selectedRowIndex = selectedRowIndex === 0 ? selectedRowIndex : (selectedRowIndex-1);
		}
		//if no rows are left, create a new one
		if(!activists.length)
			activists.push({
				firstName:"", lastName:"", phone:"", residency:"", email:"",
				firstNameValid:false, lastNameValid:false, phoneValid:false, residencyValid:false, emailValid:false,
				scanRow:0});
		//commit to state
		this.setState({activists: activists, selectedRowIndex:selectedRowIndex});
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
		if(!FieldValidation.validateAll(activists)){
			this.setState({postAttempted: true});
			return;
		}
		const data ={
			"activists": activists,
			"scanId": this.state.scanId,
			"markedDone": this.state.fullyTyped
		};
		server.post('activists/uploadTyped', data)
		.then(json => {
			this.setState({
				activists: [{
					firstName:"", lastName:"", phone:"", residency:"", email:"",
					firstNameValid:"", lastNameValid:"", phoneValid:"", residencyValid:"", emailValid:"",
					scanRow:0}],
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
		const selectedScanRow = activists[selectedRowIndex].scanRow;
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
								handleChange={this.handleTypedInput}
								handleRowPost={this.handleRowPost}
								handleRowFocus={this.handleRowFocus}
								handleRowDeletion={this.handleRowDeletion}
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

