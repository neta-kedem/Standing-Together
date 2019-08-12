import React from 'react';
import "./ToggleSwitch.scss"

export default class ToggleSwitch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
			onChangeFunction: props.handleChange
		};
	}
	handleChange(event)
	{
		this.state.onChangeFunction(event.target.checked);
	}
	render() {
		return (
			<div className="switch-wrap">
				<label className="switch">
					<input type="checkbox" checked={this.props.value} onChange={(event)=>this.handleChange(event)}/>
					<span className="slider"/>
				</label>
			</div>
		)
	}
}
