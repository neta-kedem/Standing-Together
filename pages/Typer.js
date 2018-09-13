import React from 'react';
import Meta from '../lib/meta';
import server from '../services/server';
import HeaderBar from './typer/HeaderBar'
import TypedActivistsTable from './typer/TypedActivistsTable'
import ContactScanDisplay from './typer/ContactScanDisplay'
import style from './typer/Typer.css'



export default class Typer extends React.Component {
	constructor() {
		super();
		this.state = {
			activists:[{firstName:"", lastName:"", phone:"", city:"", email:"", scanRow:0}],
			cells: [],
			selectedRowIndex: 0
		}
	};
	componentDidMount() {
		this.getContactsScan();
		//var callPingInterval = setInterval(this.pingCalls.bind(this), this.callPingIntervalDuration);
		// store interval promise in the state so it can be cancelled later:
		//this.setState({callPingInterval: callPingInterval});
	}
	getContactsScan() {
		server.get('contactScan', {})
		.then(json => {
			if(json.error)
			{
				return;
			}
			this.setState({"scanUrl":json.scanUrl, "cells":json.rows});
		});
	}
	
	addRow=function() {
		let activists = this.state.activists.slice();
		let nextScanRow = Math.min(activists[this.state.selectedRowIndex].scanRow+1, this.state.cells.length-1);
		activists.push({firstName:"", lastName:"", phone:"", city:"", email:"", scanRow:nextScanRow});
		this.setState({activists: activists, selectedRowIndex:activists.length-1});
	}.bind(this);
	
	handleRowFocus = function(rowIndex) {
		this.setState({selectedRowIndex:rowIndex});
	}.bind(this)
	
	handleTypedInput = function (name, value, rowIndex){
		let activists = this.state.activists.slice();
		activists[rowIndex][name] = value;
		this.setState({activists: activists});
	}.bind(this);
	
	selectScanRow = function(index){
		let activists = this.state.activists.slice();
		activists[this.state.selectedRowIndex].scanRow = index;
		this.setState({activists: activists});
	}.bind(this);
	
	handleRowPost = function(rowIndex){
		let activists = this.state.activists.slice();
		if(rowIndex==activists.length-1)
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
		if(selectedRowIndex>=index){
			selectedRowIndex=selectedRowIndex==0?selectedRowIndex:(selectedRowIndex-1);
		}
		//if no rows are left, create a new one
		if(!activists.length)
			activists.push({firstName:"", lastName:"", phone:"", city:"", email:"", scanRow:0});
		//commit to state
		this.setState({activists: activists, selectedRowIndex:selectedRowIndex});
	}.bind(this);

	handlePost=function(){
		var data ={"activists":this.state.activists};
		server.post('activists/uploadTyped', data)
		.then(json => {
			this.setState({activists: []});
		});
	}.bind(this);
	
	render() {
		const cells = this.state.cells;
		const scanUrl = this.state.scanUrl;
		const selectedRowIndex = this.state.selectedRowIndex;
		const activists = this.state.activists;
		return (
			<div dir="rtl">
				<Meta/>
				<style jsx global>{style}</style>
				<HeaderBar sendFunction={this.handlePost.bind(this)}></HeaderBar>
				<section className="section">
					<div className="main-panel">
						<ContactScanDisplay cells={cells} scanUrl={scanUrl} selectedRow={activists[selectedRowIndex].scanRow} selectScanRow={this.selectScanRow}/>
						<content className="content">
							<TypedActivistsTable handleChange={this.handleTypedInput} handleRowPost={this.handleRowPost} handleRowFocus={this.handleRowFocus} handleRowDeletion={this.handleRowDeletion} activists={activists} selectedRow={selectedRowIndex}/>
					 </content>
					</div>
				</section>
			</div>
		)
	}
}

