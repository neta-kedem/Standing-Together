import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {faTrashAlt, faPenSquare} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faTrashAlt, faPenSquare);

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
		return (
			<div>
				<div className={"setting-title"}>{this.state.details.name}</div>
				<div className={"setting-content-wrap"}>
					{settingValues.map((set, i)=>{
						return <div className={"setting-value-wrap"} key={this.state.details.name+"_"+i}>
							<div className={"remove-setting-value"} onClick={()=>{this.removeValue(i)}}>✖</div>
							<input className={"setting-value-input"} type={this.state.details.type} value={set} onChange={(event)=>{this.setValue(event, i)}}/>
						</div>
					})}
					<div className={"add-setting-value"} onClick={this.addValue}>🞢</div>
				</div>
			</div>
		);
	}
}