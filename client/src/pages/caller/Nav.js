import React from 'react';
import style from './Nav.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
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
		const items = <div className={'saved-views'}>התקשרות ל{this.props.name} {this.props.lname} בטלפון {this.props.phone} בקשר ל{this.props.event}</div>;
		return (
			<div className={"wrapper"}>
				<div className={"logo"}/>
				<div className={"saved-views-wrap"}>
					{items}
				</div>
			</div>
		)
	}
}
