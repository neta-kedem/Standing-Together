import React from 'react';
import style from './Nav.scss'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'
library.add(faChevronCircleLeft);

export default class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			savedViews: props['savedViews']
		};
	}
	render() {
		//const itemChilds = this.state.savedViews.map(view => <div key={view.name} style={style['saved-views']}>{view.name}</div>);
		const items = <div style={style['saved-views']}>התקשרות ל{this.props.name} {this.props.lname} בטלפון {this.props.phone} בקשר ל{this.props.event}</div>;
		return (
			<div style={style.wrapper}>
				<div style={style.logo}></div>
				<div style={style["saved-views-wrap"]}>
					{items}
				</div>
                {/*<div style={style.heading_3}>
                    <div style={style.cloud}>סיום<br/>انهاء</div>
                    <FontAwesomeIcon icon="chevron-circle-left" style={style['cloud-icon']}/>
                </div>*/}
			</div>
		)
	}
}
