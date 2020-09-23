import React from 'react';
import "./SelectableButton.scss"

export default class SelectableButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			label: props.label,
			onClick: props.handleClickFunction
		};
	}
	handleClick = function()
	{
		this.state.onClick();
	}.bind(this);
	render() {
		return (
			<div className="selectable-button-wrap">
				<button type="button"
						className={"selectable-button " + (this.props.selected ? "selected " : "")}
						onClick={this.handleClick}>{this.state.label}</button>
			</div>
		)
	}
}
