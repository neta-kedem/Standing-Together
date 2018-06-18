import React from 'react';

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
				<style jsx global>
				{`
					.popup-wrapper{
						position: absolute;
						height: 100%;
						width: 100%;
					}
					
					.popup-background{
						position: absolute;
						height: 100%;
						width: 100%;
						background-color: rgba(80, 0, 80, 0.75);
						z-index: 0;
					}
					.popup {
						position: relative;
						margin: 10vh auto;
						width: 30%;
						max-height: 80vh;
						background-color: #f7f5f6;
						padding: 2.5%;
						z-index: 1;
					}
				`}
				</style>
				<div className="popup-background" onClick={this.handleBackgroundClick.bind(this)}></div>
				<div className="popup">
					{this.props.children}
				</div>
			</div>
		):<div></div>
	}
}
