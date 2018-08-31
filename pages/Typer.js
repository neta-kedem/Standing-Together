import React from 'react';
import Meta from '../lib/meta';
import server from '../services/server';
import HeaderBar from './typer/HeaderBar'
import TableRow from './typer/TableRow'
import TitleRow from './typer/TitleRow'
import InputFields from './typer/InputFields'
import InputRow from './typer/InputRow'
import ContactScanDisplay from './typer/ContactScanDisplay'
import style from './typer/Typer.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faCheckSquare } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faCheckSquare);
import { faSave } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faSave);
import { faTrashAlt } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faTrashAlt);



export default class Typer extends React.Component {
	constructor() {
		super();
		this.state = {
			data:[],
			cells: [],
			selectedRow: 0
		}
		this.addRow = this.addRow.bind(this);
		this.deleteRow = this.deleteRow.bind(this);
		this._handleKeyPress = this._handleKeyPress.bind(this);
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
	addRow() {
		var input = document.createElement("input");
		var fname = document.getElementById("firstName").value;
		var lname = document.getElementById("lastName").value;
		var mail = document.getElementById("mail").value;
		var city = document.getElementById("city").value;
		var phone = document.getElementById("phNo").value;
		var item = {
			"fname": fname,
			"lname": lname,
			"settlement": city,
			"phone": phone,
			"mail": mail
		}
		this.setState((prevState, props) => ({
			data: [...prevState.data, item]
		}));
	};

	handleChangeEvent = (value, cell, index) => {
		let newState = this.state.data.slice(0);
		newState[cell][index] = value;
		this.setState({data: newState});
	};

	_handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.addRow();
		}
	};

	deleteRow(index){
		var contacts = [...this.state.data];
		contacts.splice(Number(index), 1);
		this.setState((props) => ({
			data: contacts
		}));
	};

	handlePost(){
		var data ={"activists":this.state.data};
		server.post('activists/uploadTyped', data)
		.then(json => {
			this.setState({data: []});
		});
	};
	render() {
		return (
			<div>
				<Meta/>
				<style jsx global>{style}</style>
				<HeaderBar sendFunction={this.handlePost.bind(this)}></HeaderBar>
				<section className="section">
					<div className="main-panel">
						<ContactScanDisplay cells={this.state.cells} scanUrl={this.state.scanUrl} selectedRow={this.state.selectedRow}/>
						<content className="content">
							<TitleRow></TitleRow>
							<div className="save-div">
								<span onClick ={this.addRow}>
									<FontAwesomeIcon id="save" icon="save" className="save-btn"/>
								</span>
								<InputRow handleKeyPress={this._handleKeyPress}></InputRow>
							</div>
							<table className="info_table">
								 <tbody className="row">{
									 this.state.data.map((person, i) =>
									 <div>
										 <FontAwesomeIcon onClick ={this.deleteRow.bind(this,i)} key={i+0.1} id="delete" icon="trash-alt" className="save-btn"/>
										 <TableRow key={i} data={person} num={i}
										 handleChangeEvent={this.handleChangeEvent} handleKeyPress={this._handleKeyPress}/>
									</div>)
								}</tbody>
							</table>
					 </content>
					</div>
				</section>
			</div>
		)
	}
}

