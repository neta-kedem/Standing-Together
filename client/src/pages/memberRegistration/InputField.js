import React from 'react';
import DatePicker from 'react-date-picker';

export default class InputField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			field: props['field'],
			handlePost: props['handlePost'],
			handleChange: props['handleChange']
		};
	}
	
	syncStateToInput=function(fieldVal){
		this.state.handleChange(this.state.field.name, fieldVal);
	}.bind(this);
	
	render() {
		const fieldValue = this.props.fieldValue || "";
		const f = this.state.field;
		return (
			<div className={"field-wrap"}>
				<label htmlFor={"field-"+f.name} className={"input-field-label"}>
					<div>{f.ar}</div>
					<div>{f.he}</div>
				</label>
				{f.type === "date"
				?	<DatePicker
						dir = "ltr"
						id={"field-"+f.name}
						value={fieldValue}
						onChange = {(date) => {this.syncStateToInput(date)}}
						disableCalendar = {true}
						format="yy-M-d"
					/>
				:	<input
						value={fieldValue} type={f.type} name={f.name} id={"field-"+f.name}
						onChange = {(e) => {this.syncStateToInput(e.target.value)}}
						list = {f.name + "-data-list"}
						autoComplete = "new-password"
						className={"input-field"}
					/>
				}
			</div>
		);
	}
}