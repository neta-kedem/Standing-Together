import React from 'react';
import style from './TopNavBar.css'

export default class TopNavBar extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div style={style.wrapper}>
				<div style={style.logo}></div>
				{this.props.children}
			</div>
		)
	}
}
