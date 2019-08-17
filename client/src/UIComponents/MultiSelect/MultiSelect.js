import React from 'react';
import "./MultiSelect.scss";

export default class MultiSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			values: props.values,
			labelIndex: props.label,
			selectionIndex: props.selection,
			onChangeFunction: props.handleChange
		};
	}
	handleChange(event, i)
	{
		const values = this.state.values.slice();
		values[i][this.state.selectionIndex]=event.target.checked;
		this.setState({values: values});
		this.state.onChangeFunction(i, event.target.checked);
	}
	render() {
		const options = this.state.values.map((val, i) =>
				<div key={i}>
					<label className="multi-select-option">
						<input type="checkbox" defaultChecked={val[this.state.selectionIndex]} onChange={(event)=>this.handleChange(event, i)}/>
						{val[this.state.labelIndex]}
					</label>
				</div>);
		return (
			<div>
				{options}
			</div>
		)
	}
}
