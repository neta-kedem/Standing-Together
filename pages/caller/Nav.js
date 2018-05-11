import React from 'react';
import style from './Nav.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faStopCircle } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faStopCircle);

export default class Nav extends React.Component {
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
                <div style={style.heading_3}>
                    <div style={style.cloud}>סיום<br/>انهاء</div>
                    <FontAwesomeIcon icon="stop-circle" style={style['cloud-icon']}/>
                </div>
			</div>
		)
	}
}
