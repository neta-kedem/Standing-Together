import React from 'react';
import "./SelectorItem.scss";

export default class SelectorItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			item: props.item,
			titleIndex: props.titleIndex,
			onSelectFunction: props.onSelectFunction
		};
	}
	handleSelect()
	{
		this.state.onSelectFunction(this.state.item);
	}
	render() {
		return (
			<div>
				<div className="selector-item" onClick={this.handleSelect.bind(this)}>
					{this.state.item[this.state.titleIndex]}
				</div>
			</div>
		)
	}
}
