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
						<div className="sidebar-background" onClick={this.toggleMenu}/>
						<div className={"sidebar-wrap"}>
							<div className={"sidebar"}>
								<div className="sidebar-title">
									قائمة - תפריט
								</div>
								<div className="sidebar-options">
									<div className="sidebar-item button" onClick={this.logout.bind(this)}>
										<div className="sidebar-item-ar">התנתקות מהמערכת</div>
										<div className="sidebar-item-he">התנתקות מהמערכת</div>
									</div>
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("Organizer")}}>
										<div className="sidebar-item-ar">ادارة جهات اتصال</div>
										<div className="sidebar-item-he">ניהול אנשי קשר</div>
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("EventManagement")}}>
										<div className="sidebar-item-ar">ادارة احداث</div>
										<div className="sidebar-item-he">ניהול אירועים</div>
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("EventCreation")}}>
										<div className="sidebar-item-ar">انشاء حدث</div>
										<div className="sidebar-item-he">אירוע חדש</div>
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("CityManagement")}}>
										<div className="sidebar-item-ar">ادارة بلدات</div>
										<div className="sidebar-item-he">ניהול ערים</div>
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("CircleManagement")}}>
										<div className="sidebar-item-ar">ניהול מעגלים</div>
										<div className="sidebar-item-he">ניהול מעגלים</div>
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("EventCategoriesManagement")}}>
										<div className="sidebar-item-ar">ניהול קטגוריות אירועים</div>
										<div className="sidebar-item-he">ניהול קטגוריות אירועים</div>
									</div>:""}
									{permissions.isOrganizer || permissions.isTyper?<div className="sidebar-item button" onClick={()=>{this.goToPage("Typer")}}>
										<div className="sidebar-item-ar">עמוד קלדנות</div>
										<div className="sidebar-item-he">עמוד קלדנות</div>
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("ScanContacts")}}>
										<div className="sidebar-item-ar">مسح صفحات اتصال</div>
										<div className="sidebar-item-he">סריקת דפי קשר</div>
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("ImportContacts")}}>
										<div className="sidebar-item-ar">ייבוא אנשי קשר</div>
										<div className="sidebar-item-he">ייבוא אנשי קשר</div>
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("DailySummary")}}>
										<div className="sidebar-item-ar">סיכום פעילות יומי</div>
										<div className="sidebar-item-he">סיכום פעילות יומי</div>
									</div>:""}
									{permissions.isOrganizer?<div className="sidebar-item button" onClick={()=>{this.goToPage("Settings")}}>
										<div className="sidebar-item-ar">הגדרות</div>
										<div className="sidebar-item-he">הגדרות</div>
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
