import React from 'react';
import style from './QueryResultsActionMenu.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

class QueryResultsActionMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: props['items'],
			toggleEventPopup: props['toggleEventPopup']
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
				<div className="results-count">20,000 פעילים נמצאו</div>
				<div className="action-button" onClick={this.handlePhoneListClick.bind(this)}><FontAwesomeIcon className="action-button-icon" icon="phone"></FontAwesomeIcon> קמפיין טלפוני</div>
				<div className="action-button"><FontAwesomeIcon className="action-button-icon" icon="envelope-open"></FontAwesomeIcon> מייל קבוצתי</div>
				{items}
			</div>
		)
	}
}

export default QueryResultsActionMenu;