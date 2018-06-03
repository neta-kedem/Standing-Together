import React from 'react';
import style from './QueryResultsActionMenu.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

class QueryCreator extends React.Component {
	constructor(props) {
	super(props);
	this.state = {items: props['items']};
}
	render() {
		const items = this.state.items.map(item => <div key={item.index} className={"action-button "+(item.alignToEnd?"align-to-end":"")}>{item.content}</div>);
		return(
			<div className="query-results-wrapper">
				<style jsx global>{style}</style>
				<div className="results-count">20,000 People Found</div>
				<div className="action-button"><FontAwesomeIcon className="action-button-icon" icon="phone"></FontAwesomeIcon> Phone List</div>
				<div className="action-button"><FontAwesomeIcon className="action-button-icon" icon="envelope-open"></FontAwesomeIcon> Group Email</div>
				{items}
			</div>
		)
	}
}

export default QueryCreator;
