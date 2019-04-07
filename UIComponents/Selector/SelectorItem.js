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
						padding: 0.5%;
						color: white;
						transition: color 0.25s, background-color 0.25s;
						cursor: pointer;
					}
					.selector-item:hover{
						background-color: white;
						color:rgb(144, 39, 142);
					}
					.selector-item:active{
						background-color: #ccc;
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
