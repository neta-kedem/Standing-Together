import React from 'react';

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
				<style jsx global>{`
					.selector-item{
						padding: 2%;
						background-color: #ccc;
						transition: background-color 1.5s;
						transition: color 0.5s;
						cursor: pointer;
					}
					.selector-item:hover{
						background-color: #ffb4d0;
						transition: background-color 0.5s;
					}
					.selector-item:active{
						background-color: #dc1560;
						color: white;
					}
				`}
				</style>
				<div className="selector-item" onClick={this.handleSelect.bind(this)}>
					{this.state.item[this.state.titleIndex]}
				</div>
			</div>
		)
	}
}
