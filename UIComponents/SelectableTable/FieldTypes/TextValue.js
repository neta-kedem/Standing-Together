import React from 'react';

export default class TextValue extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
		};
	}
	render() {
		return (
			<div>
				{this.state.value}
			</div>
		)
	}
}
