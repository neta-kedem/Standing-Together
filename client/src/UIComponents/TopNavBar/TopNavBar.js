import React from 'react';
import './TopNavBar.scss';
import server from '../../services/server';
import cookie from 'js-cookie';
import { withRouter } from 'react-router-dom'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
library.add(faBars);

export default withRouter(class TopNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			justification: this.props.justification || "end",
			menuOpened: false,
			permissions: {}
		}
	}
	componentDidMount() {
		this.setState({permissions: this.getPermissions()})
	}
	getPermissions(){
		const json = cookie.get("permissions");
		if(!json)
			return {};
		try{
			return JSON.parse(json);
		}
		catch (e) {
			return {}
		}
	}
	logout(){
		server.get('logout', {})
			.then(json => {
				this.props.history.push('/Login')
			});
	}
	toggleMenu = function(){
		this.setState({menuOpened: !this.state.menuOpened});
	}.bind(this);

	goToPage = function(page){
		this.props.history.push('/' + page)
	}.bind(this);

	render() {
		const permissions = this.state.permissions;
		return (
			<div className="nav-bar-wrapper" style={{"justifyContent":this.state.justification}} dir={"rtl"}>
				<div className="nav-bar">
                	<div className={"nav-bar-logo-menu-wrap " + (this.state.menuOpened ? "sidebar-open" : "")}>
						<div className="nav-bar-icon" onClick={this.toggleMenu}>
							<FontAwesomeIcon icon="bars"/>
							<span className={"menu-label"}>
								<div>قائمة</div>
								<div>תפריט</div>
							</span>
						</div>
						<div className="sidebar-background" onClick={this.toggleMenu}> </div>
						<div className={"sidebar-wrap"}>
							<div className={"sidebar"}>
								<div className="sidebar-options">
									<div className="sidebar-title">
										قائمة - תפריט
									</div>
									<div className="sidebar-item button" onClick={this.logout.bind(this)}>
										התנתקות מהמערכת
									</div>
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("Organizer")}}>
										ניהול אנשי קשר
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("EventManagement")}}>
										ניהול אירועים
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("EventCreation")}}>
										אירוע חדש
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("CityManagement")}}>
										ניהול ערים
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("CircleManagement")}}>
										ניהול מעגלים
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("EventCategoriesManagement")}}>
										ניהול קטגוריות אירועים
									</div>:""}
									{permissions.isOrganizer || permissions.isTyper?<div className="sidebar-item button" onClick={()=>{this.goToPage("Typer")}}>
										עמוד קלדנות
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("ScanContacts")}}>
										סריקת דפי קשר
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("ImportContacts")}}>
										ייבוא אנשי קשר
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("DailySummary")}}>
										סיכום פעילות יומי
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("Settings")}}>
										הגדרות
									</div>:""}
								</div>
							</div>
                		</div>
					</div>
					{this.props.children}
				</div>
			</div>
		)
	}
})
