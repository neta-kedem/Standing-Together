import React from 'react';
import './QueryResultsActionMenu.scss'
import excel from  '../../static/Excel.svg'

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
		const items = this.state.items.map(
			(item, i) =>
				<div key={i} className={"action-button " + (item.alignToEnd ? "align-to-end" : "")}>
					{item.content}
				</div>
		);
		return(
			<div className="query-results-wrapper">
				<div className="results-count">لقد تم العثور على {this.props.activistCount} جهات اتصال</div>
				<div className="results-count">{this.props.activistCount} פעילים נמצאו</div>
				<button type="button" className="action-button" onClick={this.state.downloadActivistsByQuery}>
					<img alt="export to excel" className="action-button-icon" src={excel}/>
					تحويل لملف اكسل
					ייצוא לאקסל
				</button>
				{items}
			</div>
		)
	}
}

export default QueryResultsActionMenu;