import React from 'react';
import "./HamburgerMenu.scss";

export default class HamburgerMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			content: props.content,
			isOpen: false,
			leftAlignment: false
		};
	}
	handleMenuToggle(event) {
		const leftAlignment = event.target.offsetParent.offsetLeft*2>window.innerWidth;
		this.setState({isOpen: !this.state.isOpen, leftAlignment: leftAlignment});
	}
	render() {
		return (
			<div className="menu-wrapper">
				<div dir="ltr" className={"hamburger " + (this.state.isOpen ? 'change' : '')} onClick={this.handleMenuToggle.bind(this)}>
					<div className="bar1"/>
					<div className="bar2"/>
					<div className="bar3"/>
				</div>
				<div className={"menu-content " + (this.state.isOpen ? 'open' : '') + (this.state.leftAlignment ? 'left-align' : '')}>
					{this.state.content}
				</div>
			</div>
		)
	}
}
