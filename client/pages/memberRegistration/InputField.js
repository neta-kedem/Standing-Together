import React from 'react';

export default class InputField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lang: props['lang'],
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
			<div>
				<input value={fieldValue} type={f.type} name={f.name} placeholder={f[this.state.lang]}
					   onChange = {this.syncStateToInput}
					   list = {f.name + "-data-list"}
					   autoComplete = "new-password"
					   className={"input-field"}
				/>
			</div>
		);
	}
}