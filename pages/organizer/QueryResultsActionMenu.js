import React from 'react';
import style from './QueryResultsActionMenu.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

class QueryCreator extends React.Component {
	render() {
		return(
			<div style={style.wrapper}>
				<div style={style["results-count"]}>20,0000</div>
				<div style={style["action-button"]}><FontAwesomeIcon style={style["action-button-icon"]} icon="phone"></FontAwesomeIcon> Phone List</div>
				<div style={style["action-button"]}><FontAwesomeIcon style={style["action-button-icon"]} icon="envelope-open"></FontAwesomeIcon> Group Email</div>
			</div>
		)
	}
}

export default QueryCreator;
