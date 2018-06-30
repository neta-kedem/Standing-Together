import React from 'react';

export default class Toggle extends React.Component {
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
			<div className="switch-wrap">
				<style jsx global>{`
					.switch-wrap{
						height:100%;
					}
					.switch {
						position: relative;
						display: inline-block;
						width: 3em;
						height: 100%;
					}
					
					.switch input {
						display:none;
					}
					
					.slider {
						height:1.5em;
						position: absolute;
						cursor: pointer;
						top: -1em;
						left: 0;
						right: 0;
						bottom: 0;
						border-radius: 3px;
						box-sizing: border-box;
						border: 1px solid #616B6F;
						background-color: #fff;
						-webkit-transition: .4s;
						transition: .4s;
					}
					
					.slider:before {
						position: absolute;
						top: -1px;
						left: -1px;
						content: "";
						height: 1.5em;
						width: 1.5em;
						border-radius: 3px;
						background-color: #616B6F;
						-webkit-transition: .4s;
						transition: .4s;
					}
					
					input:checked + .slider {
						background-color: #FF4C94;
					}
					
					input:checked + .slider:before {
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
