import React from 'react';
import "./Checkbox.scss"

export default class Checkbox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			onChange: props.onChange,
			label: props.label
		};
	}
	handleChange = function(event){
		this.state.onChange(event.target.checked);
	}.bind(this);
	render() {
		return <div className="checkbox-wrapper">
				<div className="control-group">
					<label className="control control-checkbox">
						<input type="checkbox" checked={this.props["checked"]} onChange={this.handleChange}/>
						<div className="control_indicator"/>
						<div className={"checkbox-label"}> {this.state.label} </div>
					</label>
				</div>
			</div>;
	}
}
