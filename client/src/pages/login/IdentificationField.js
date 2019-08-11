import React from 'react';
import './IdentificationField.scss';

import { library, dom } from '@fortawesome/fontawesome-svg-core'
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
		this.syncStateToInput=function(event){
			this.setState({value: event.target.value});
		};
		this.handlePost=function(){
			if(this.state.validationFunction(this.state.value))
				this.state.identificationFunction(this.state.value);
		};
	}
	handleKeyPress = (event) => {
		if(event.key === 'Enter'){
			this.handlePost();
		}
	};
	
	render() {
		return (
			<div>
				<div className='credentials-field-wrap'>	
					<input onChange={(event)=>this.syncStateToInput(event)} onKeyPress={this.handleKeyPress} dir={this.state.dir} type={this.state.inputType} autoFocus minLength={this.state.minLength} maxLength={this.state.maxLength} className='credentials-field' placeholder={this.state.placeholder}></input>
					<div className={'login-button-wrap '+(this.state.validationFunction(this.state.value)?'valid-input ':'invalid-input ')}>
						<div onClick={this.handlePost.bind(this)} className='login-button'>
							<FontAwesomeIcon className='login-button-icon' icon="paper-plane"/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
