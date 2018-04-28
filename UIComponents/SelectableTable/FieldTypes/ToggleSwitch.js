import React from 'react';

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
		this.setState({value: event.target.checked});
		this.state.onChangeFunction(event.target.checked);
	}
	render() {
		return (
			<div>
				<style jsx global>{`
					.switch {
						position: relative;
						display: inline-block;
						width: 3em;
						height: 1.5em;
					}
					
					.switch input {
						display:none;
					}
					
					.slider {
						position: absolute;
						cursor: pointer;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						border-radius: 3px;
						background-color: #ccc;
						box-shadow: 0px 0px 3px black inset;
						-webkit-transition: .4s;
						transition: .4s;
					}
					
					.slider:before {
						position: absolute;
						content: "";
						height: 1.5em;
						width: 1.5em;
						border-radius: 3px;
						background-color: white;
						box-shadow: 0px 0px 3px #888 inset;
						-webkit-transition: .4s;
						transition: .4s;
					}
					
					input:checked + .slider {
						background-color: rgb(255, 76, 148);
					}
					
					input:focus + .slider {
						box-shadow: 0 0 1px rgb(255, 76, 148)
					}
					
					input:checked + .slider:before {
						box-shadow: 0px 0px 3px rgb(255, 76, 148) inset;
						-webkit-transform: translateX(1.5em);
						-ms-transform: translateX(1.5em);
						transform: translateX(1.5em);
					}
				`}
				</style>
				<label className="switch">
					<input type="checkbox" defaultChecked={this.state.value} onChange={(event)=>this.handleChange(event)}/>
					<span className="slider"></span>
				</label>
			</div>
		)
	}
}
