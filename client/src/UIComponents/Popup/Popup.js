import React from 'react';
import "./Popup.scss";

export default class Popup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			toggleVisibility: props.toggleVisibility,
			width: props.width
		};
	}
	handleBackgroundClick() {
		this.state.toggleVisibility();
	}
	render() {
		return this.props.visibility?(
			<div className="popup-wrapper">
				<div className="popup-background" onClick={this.handleBackgroundClick.bind(this)}/>
				<div className="popup">
					{this.props.children}
				</div>
			</div>
		):<div/>
	}
}
