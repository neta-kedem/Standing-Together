import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import {faTrashAlt, faPenSquare} from '@fortawesome/free-solid-svg-icons'
library.add(faTrashAlt, faPenSquare);

export default class SettingDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			details: props['details'],
			rowIndex: props['rowIndex'],
			setValue: props['setValue'],
			addValue: props['addValue'],
			removeValue: props['removeValue']
		};
	}

	setValue=function(event, valIndex){
		this.state.setValue(event.target.value, this.state.rowIndex, valIndex);
	}.bind(this);
	removeValue=function(valIndex){
		this.state.removeValue(this.state.rowIndex, valIndex);
	}.bind(this);
	addValue=function(){
		this.state.addValue(this.state.rowIndex);
	}.bind(this);

	render() {
		const settingValues = this.props.details.values.slice();
		const singleValue = this.props.details.singleValue;
		return (
			<div>
				<div className={"setting-title"}>{this.state.details.name}</div>
				<div className={"setting-content-wrap"}>
					{settingValues.map((set, i)=>{
						return <div className={"setting-value-wrap"} key={this.state.details.name+"_"+i}>
							{!singleValue ? <div className={"remove-setting-value"} onClick={()=>{this.removeValue(i)}}>✖</div> : null}
							<input className={"setting-value-input"} type={this.state.details.type} value={set} onChange={(event)=>{this.setValue(event, i)}}/>
						</div>
					})}
					{!singleValue ? <div className={"add-setting-value"} onClick={this.addValue}>🞢</div> : null}
				</div>
			</div>
		);
	}
}