import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Meta from '../lib/meta';

import TopNavBar from './organizer/TopNavbar'
import ItemService from '../services/ItemService'
import QueryCreator from './organizer/QueryCreator'
import QueryResultsActionMenu from './organizer/QueryResultsActionMenu'
import style from './organizer/Organizer.css'

export default class Organizer extends React.Component {

state = {activists: [], currFilters: [], allSelected: false};

componentDidMount() {
	ItemService.getAcivists()
		.then(activists =>
				this.setState({activists}));
	ItemService.getCurrFilters()
		.then(currFilters =>
				this.setState({currFilters}));
}

toggleAllActivistsSelection() {
	const activists = this.state.activists.slice();
	for (var i=0; i<activists.length; i++)
	{
		activists[i].selected = !this.state.allSelected;
	}
	this.setState({activists: activists, allSelected: !this.state.allSelected});
}

toggleActivistSelection(i) {
	const activists = this.state.activists.slice();
	activists[i].selected = !activists[i].selected;
	this.setState({activists: activists});
}

render() {
	const itemChilds = this.state.activists.map((activist, i) =>
		<tr key={activist._id} style={style['list-table-row']} onClick={() => this.toggleActivistSelection(i)}>
			{/*the ... is a weird things that spreads the content of an array, thus allowing arrayy concatanation.
			I used it where multiple styles should have been applied to a single dom*/}
			<td style={{...style['list-row-selection-indicator'], ...(activist.selected?style['selected-table-row']:{})}}> </td>
			<td style={style['list-table-field']}>{activist.firstname}</td>
			<td style={style['list-table-field']}>{activist.lastname}</td>
			<td style={style['list-table-field']}>{activist.city}</td>
			<td style={style['list-table-field']}>{activist.phone}</td>
			<td style={style['list-table-field']}>{activist.email}</td>
		</tr>);

	return (
		<div style={style["pageWrap"]}>
			<Meta/>
			<link
				href='http://fonts.googleapis.com/css?family=Cabin'
				rel='stylesheet'
				type='text/css'
			></link>
			<TopNavBar savedViews={[{'name':'New Activists'}, {'name':'Callers in Haifa'}]}></TopNavBar>
			<div style={style.wrapper}>
				<div style={style.leftPanel}>
					<QueryCreator currFilters={this.state.currFilters}></QueryCreator>
				</div>
				<div style={style['main-panel']}>
					<QueryResultsActionMenu></QueryResultsActionMenu>
					<div style={style['results-wrap']}>
						<div style={style['query-results']}>
							<table style={style['list-table']}>
								<thead>
									<tr style={style['list-table-header']}>
										<th> </th>
										<th style={style['list-table-header-field']}><FontAwesomeIcon icon="user"></FontAwesomeIcon> First Name</th>
										<th style={style['list-table-header-field']}><FontAwesomeIcon icon="user"></FontAwesomeIcon> Last Name</th>
										<th style={style['list-table-header-field']}><FontAwesomeIcon icon="building"></FontAwesomeIcon> Lives In</th>
										<th style={style['list-table-header-field']}><FontAwesomeIcon icon="phone"></FontAwesomeIcon> Phone</th>
										<th style={style['list-table-header-field']}><FontAwesomeIcon icon="envelope-open"></FontAwesomeIcon> Email</th>
									</tr>
								</thead>
								<tbody>
									{itemChilds}
								</tbody>
							</table>
							<br></br>
							<div style={style['select-all-checkbox']} onClick={() => this.toggleAllActivistsSelection()}>
								<div style={{...style['checkbox'],...(this.state.allSelected?style['checkbox-checked']:{})}}><FontAwesomeIcon icon="check-square"></FontAwesomeIcon></div>
								SELECT ALL
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

}

