import React from 'react';
import style from './TopNavbar.css'

export default class TopNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			savedViews: props['savedViews']
		};
	}
	render() {
		const itemChilds = this.state.savedViews.map(view => <div key={view.name} style={style['saved-views']}>{view.name}</div>);
		return (
			<div style={style.wrapper}>
				<div style={style.logo}></div>
				<div style={style["saved-views-wrap"]}>
					{itemChilds}
				</div>
			</div>
		)
	}
}
