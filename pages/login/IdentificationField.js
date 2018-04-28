import React from 'react';
import style from './IdentificationField.css';

import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faPaperPlane);

export default class IdentificationField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validationFunction: props['validationFunction'],
			identificationFunction: props['identificationFunction'],
			inputType: props['inputType'],
			placeholder: props['placeholder'],
			dir: props['dir'],
			minLength: props['minLength'],
			maxLength: props['maxLength'],
			value: ''
		};
		this.syncStateToInput=function(event){
			this.setState({value: event.target.value});
		};
		this.handlePost=function(){
			if(this.state.validationFunction(this.state.value))
				this.state.identificationFunction(this.state.value);
		};
	}
	handleKeyPress = (event) => {
		if(event.key == 'Enter'){
			this.handlePost();
		}
	}
	
	render() {
		return (
			<div style={style['credentials-field-wrap']}>
				<input onChange={(event)=>this.syncStateToInput(event)} onKeyPress={this.handleKeyPress} dir={this.state.dir} style={style['login-button']} type={this.state.inputType} autoFocus minLength={this.state.minLength} maxLength={this.state.maxLength} style={style['credentials-field']} placeholder={this.state.placeholder}></input>
				<div style={{...style['login-button-wrap'], ...(this.state.validationFunction(this.state.value)?style['valid-input']:style['invalid-input'])}}>
					<div onClick={this.handlePost.bind(this)} style={style['login-button']}>
						<FontAwesomeIcon style={style['login-button-icon']} icon="paper-plane"/>
					</div>
				</div>
			</div>
		)
	}
}
