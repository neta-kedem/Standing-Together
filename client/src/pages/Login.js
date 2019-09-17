import React from 'react';
import server from '../services/server';
import cookie from 'js-cookie';
import IdentificationField from './login/IdentificationField';
import LogoutReminder from './login/LogoutReminder';
import './login/Login.scss';
import logo from "../static/logo_purple.svg"
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSignInAlt} from '@fortawesome/free-solid-svg-icons'
import QueryString from "query-string";
import PubSub from "pubsub-js";
import events from "../lib/events";
library.add(faSignInAlt);

export default class Login extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		redirect: QueryString.parse(props.location.search, { ignoreQueryPrefix: true }).redirect,
		phone: "",
		email: "",
		code: "",
		codeSent: false,
		displayLogoutReminder: !cookie.get('personalComputer')
	};
}

closeLogoutReminder = function(isPersonalComputer){
	this.setState({displayLogoutReminder: false}, ()=>{
		if(isPersonalComputer) {
			cookie.set('personalComputer', true);
		}
	})
}.bind(this);

validatePhone = function(phone){
	const length = phone.length>9;
	//strips the input string of all hyphens, parentheses, and white spaces
	const num = phone.replace(/([-()+\s])/g, '');
	//checks that the result is composed entirely of digits, and is between 9 and 11 chars long.
	const digitsOnly = /^[0-9]{9,15}$/g.test(num);
	return length && digitsOnly;
};

validateEmail = function(email){
	//checks for example@example.example, such that [example] doesn't contain a '@'
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

identifyByPhone(phone){
	server.post('identify/phone', {'phone':phone})
	.then(() => {
		this.setState({codeSent: true, identificationMethod: "SMS", phone: phone});
	});
}

identifyByEmail(email){
	server.post('identify/email', {'email':email})
	.then(() => {
		this.setState({codeSent: true, identificationMethod: "Email", email: email});
	});
}

setLoginCode = function (event){
	this.setState({code: event.target.value})
}.bind(this);

handleCodeKeyDown = function(event){
	if(event.key === 'Enter'){
		this.verifyLoginCode();
	}
}.bind(this);

resendCode = function(){
	this.setState({codeSent: false});
}.bind(this);

verifyLoginCode()
{
	const code = this.state.code;
	const method = this.state.identificationMethod === "Email" ? "login/email" : "login/phone";
	const data ={'phone':this.state.phone, 'email':this.state.email, 'code':code};
	server.post(method, data)
	.then(json => {
		if(json.error)
		{
			switch(json.error){
				case "incorrect credentials":
					PubSub.publish(events.alert, {
						content: "the email or code you've entered are incorrect - try again.",
						flush: false,
						opaque: false,
						onClose: () => {},
						resolutionOptions: [
							{
								label: "ok",
								onClick: () => {PubSub.publish(events.clearAlert, {})},
							}
						]
					});
					break;
				case "missing identification":
					PubSub.publish(events.alert, {
						content: "please provide an email address",
						flush: false,
						opaque: false,
						onClose: () => {},
						resolutionOptions: [
							{
								label: "ok",
								onClick: () => {PubSub.publish(events.clearAlert, {})},
							}
						]
					});
					break;
				case "locked":
					PubSub.publish(events.alert, {
						content: "your account has been locked. " +
							"contact the system administrators to unlock your account.",
						flush: false,
						opaque: false,
						onClose: () => {},
						resolutionOptions: [
							{
								label: "ok",
								onClick: () => {PubSub.publish(events.clearAlert, {})},
							}
						]
					});
					break;
				case "tooManyLogins":
					PubSub.publish(events.alert, {
						content: "you have made too many incorrect login attempts, and your user has been locked out of the system. " +
							"contact the system administrators to unlock your account.",
						flush: false,
						opaque: false,
						onClose: () => {},
						resolutionOptions: [
							{
								label: "ok",
								onClick: () => {PubSub.publish(events.clearAlert, {})},
							}
						]
					});
					break;
				default:
					PubSub.publish(events.alert, {
						content: "an unknown error has occurred. Try again later.",
						flush: false,
						opaque: false,
						onClose: () => {},
						resolutionOptions: [
							{
								label: "ok",
								onClick: () => {PubSub.publish(events.clearAlert, {})},
							}
						]
					});
					break;
			}
		}
		if(json.token)
		{
			cookie.set('token', json.token, {expires: 30});
			cookie.set('permissions', JSON.stringify(json.permissions), {expires: 30});
			if(this.state.redirect){
				try{
					this.props.history.push(decodeURIComponent(this.state.redirect));
					return;
				}
				catch(e){
					console.log(e)
				}
			}
			if(json.permissions.isOrganizer){
				this.props.history.push('/Organizer');
				return;
			}
			if(json.permissions.isTyper){
				this.props.history.push('/Typer');
				return;
			}
			if(json.permissions.isCaller){
				this.props.history.push('/Caller');
			}
		}
	});
}

render() {
	/**Stage 1 - Verification Method Selection**/
	//TODO - the arabic here isn't up to date
	const identification =
		<div>
			<div className='identification-input-title'>
				<div>
					مصادقة عبر
				</div>
				<div>
					הזינו כתובת אימייל
				</div>
			</div>
			<IdentificationField
				dir="ltr" inputType="email" minLength="5" maxLength="100"
				placeholder="Email Address"
				validationFunction={this.validateEmail}
				identificationFunction={this.identifyByEmail.bind(this)}
			/>
		</div>;
	/**Stage 2 - Login Code Input**/
	const loginCode =
		<div>
			<br/>
			<div className='code-input-title'>
				{"הזינו את הקוד שנשלח אליכם במייל"}
			</div>
			<br/>
			<input className={"login-code"} value={this.state.code} onChange={(event) => {this.setLoginCode(event)}} onKeyDown={(event)=>{this.handleCodeKeyDown(event)}}/>
			<button type={"button"} className={"submit-code-button"} onClick={this.verifyLoginCode.bind(this)}>
				<FontAwesomeIcon icon="sign-in-alt"/>
			</button>
			<div className={"back-to-identification"} onClick={this.resendCode}>חזרה</div>
		</div>;
	return (
		<div className='page-wrap-login' dir="rtl">
			{
				this.state.displayLogoutReminder
					? <LogoutReminder onClose={this.closeLogoutReminder}/>
					: <div>
						<img src={logo} alt="standing-together" className='logo'/>
						{this.state.codeSent ? loginCode : identification}
				</div>
			}

		</div>
	)
}

}

