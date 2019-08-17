import React from 'react';
import SelectorItem from './SelectorItem'


export default class Selector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			options: props.options,
			idIndex: props.idIndex,
			titleIndex: props.titleIndex,
			onSelectFunction: props.handleSelection
		};
	}
	handleSelect(val)
	{
		this.state.onSelectFunction(val);
	}
	render() {
		const options = this.state.options.map((opt, i) =>
				<div key={i}>
					<SelectorItem
						onSelectFunction={this.handleSelect.bind(this)}
						item={opt}
						titleIndex={this.state.titleIndex}
					/>
				</div>);
		return (
			<div>
				{options}
			</div>
		)
	}
}
