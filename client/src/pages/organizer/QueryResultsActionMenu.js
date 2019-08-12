import React from 'react';
import './QueryResultsActionMenu.scss'

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
				<div className="results-count">{this.props.activistCount} פעילים נמצאו</div>
				<div className="action-button" onClick={this.state.downloadActivistsByQuery}>
					<img alt="export to excel" className="action-button-icon" src={"../static/Excel.svg"}/>
					ייצוא לאקסל
				</div>
				{items}
			</div>
		)
	}
}

export default QueryResultsActionMenu;