import React from 'react';
import Router from 'next/router';
import style from './TopNavBar.css';
import server from '../../services/server';

export default class TopNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {justification: this.props.justification || "end"}
	}
	logout(){
		server.get('logout', {})
			.then(json => {
				Router.push({pathname: '/Login'}).then(()=>{});
			});
	}
	render() {
		return (
			<div className="nav-bar-wrapper" style={{"justifyContent":this.state.justification}}>
				<style jsx global>{style}</style>
                <div className="nav-bar-logo-menu-wrap">
				    <div className="nav-bar-logo"> </div>
				    <div className="nav-bar-logo-menu">
                        <div className="nav-bar-logout-button" onClick={this.logout.bind(this)}>
				    	    <div>התנתקות מהמערכת</div>
				    	    <div>התנתקות מהמערכת</div>
                        </div>
				    </div>
                </div>
				{this.props.children}
			</div>
		)
	}
}
