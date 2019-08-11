import React from 'react';
import Meta from '../../../lib/meta';
import style from './CodeInput.css';

export default class CodeInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			verificationFunction: props['verificationFunction']
		};
	}
	
	inputCodeChar(event){
		if(event.target.value.length>0)
		{
			if(event.target.nextSibling)
			{
				event.target.nextSibling.focus();
			}
			else
			{
				let codeChars=event.target.parentNode.children;
				let code="";
				for(var i=0; i<codeChars.length; i++)
				{
					code+=codeChars[i].value;
				}
				this.state.verificationFunction(code);
			}
		}
	}
	
	render() {
		return (
			<div style={style['code-input']} dir="ltr">
				<input autoFocus onChange={(event)=>this.inputCodeChar(event)} style={style['code-input-char']} size="1" minLength="1" maxLength="1"></input>
				<input onChange={(event)=>this.inputCodeChar(event)} style={style['code-input-char']} size="1" minLength="1" maxLength="1"></input>
				<input onChange={(event)=>this.inputCodeChar(event)} style={style['code-input-char']} size="1" minLength="1" maxLength="1"></input>
				<input onChange={(event)=>this.inputCodeChar(event)} style={style['code-input-char']} size="1" minLength="1" maxLength="1"></input>
				<input onChange={(event)=>this.inputCodeChar(event)} style={style['code-input-char']} size="1" minLength="1" maxLength="1"></input>
				<input onChange={(event)=>this.inputCodeChar(event)} style={style['code-input-char']} size="1" minLength="1" maxLength="1"></input>
			</div>
		)
	}
}
