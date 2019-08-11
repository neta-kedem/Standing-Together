import React from 'react';
import style from './QueryResultsActionMenu.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class QueryResultsActionMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: props['items'],
			toggleEventPopup: props['toggleEventPopup'],
			downloadActivistsByQuery: props['downloadActivistsByQuery']
		};
	}
	handlePhoneListClick() {
		this.state.toggleEventPopup();
	}
	render() {
		const items = this.state.items.map(item => <div key={item.index} className={"action-button "+(item.alignToEnd?"align-to-end":"")}>{item.content}</div>);
		return(
			<div className="query-results-wrapper">
				<style jsx global>{style}</style>
				<div className="results-count">{this.props.activistCount} פעילים נמצאו</div>
				{/*
				<div className="action-button" onClick={this.handlePhoneListClick.bind(this)}>
					<FontAwesomeIcon className="action-button-icon" icon="phone"/>
					קמפיין טלפוני
				</div>
				<div className="action-button">
					<FontAwesomeIcon className="action-button-icon" icon="envelope-open"/>
					מייל קבוצתי
				</div>
				*/}
				<div className="action-button" onClick={this.state.downloadActivistsByQuery}>
					<img className="action-button-icon" src={"../static/Excel.svg"}/>
					ייצוא לאקסל
				</div>
				{items}
			</div>
		)
	}
}

export default QueryResultsActionMenu;