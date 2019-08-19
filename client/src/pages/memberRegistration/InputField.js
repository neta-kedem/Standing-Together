import React from 'react';

export default class InputField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			field: props['field'],
			handlePost: props['handlePost'],
			handleChange: props['handleChange']
		};
	}
	
	syncStateToInput=function(event){
		this.state.handleChange(event.target.name, event.target.value);
	}.bind(this);
	
	render() {
		const fieldValue = this.props.fieldValue || "";
		const f = this.state.field;
		return (
			<div className={"field-wrap"}>
				<label for={"field-"+f.name} className={"input-field-label"}>
					<div>{f.ar}</div>
					<div>{f.he}</div>
				</label>
				<input value={fieldValue} type={f.type} name={f.name} id={"field-"+f.name}
					   onChange = {this.syncStateToInput}
					   list = {f.name + "-data-list"}
					   autoComplete = "new-password"
					   className={"input-field"}
				/>
			</div>
		);
	}
}