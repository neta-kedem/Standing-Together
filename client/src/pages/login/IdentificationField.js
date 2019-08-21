import React from 'react';
import './IdentificationField.scss';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons'
library.add(faPaperPlane);

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
	}
	syncStateToInput=function(event){
		this.setState({value: event.target.value});
	}.bind(this);
	handlePost=function(){
		if(this.state.validationFunction(this.state.value))
			this.state.identificationFunction(this.state.value);
	}.bind(this);
	handleKeyPress = function(event){
		if(event.key === 'Enter'){
			this.handlePost();
		}
	}.bind(this);
	
	render() {
		return (
			<div>
				<div className='credentials-field-wrap'>	
					<input autoFocus
						   className='credentials-field'
						   onChange={(event)=>this.syncStateToInput(event)}
						   onKeyPress={this.handleKeyPress}
						   dir={this.state.dir}
						   type={this.state.inputType}
						   minLength={this.state.minLength}
						   maxLength={this.state.maxLength}
						   placeholder={this.state.placeholder}/>
					<div className={'login-button-wrap '+(this.state.validationFunction(this.state.value)?'valid-input ':'invalid-input ')}>
						<button type={"button"} onClick={this.handlePost.bind(this)} className='login-button'>
							<FontAwesomeIcon className='login-button-icon' icon="paper-plane"/>
						</button>
					</div>
				</div>
			</div>
		)
	}
}
