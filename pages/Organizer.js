import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import TopNavBar from './organizer/TopNavbar'
import ItemService from '../services/ItemService'
import QueryCreator from './organizer/QueryCreator'
import QueryResultsActionMenu from './organizer/QueryResultsActionMenu'
import style from './organizer/Organizer.css'

export default class Organizer extends React.Component {

state = {activists: [], currFilters: []};

componentDidMount() {
	ItemService.getAcivists()
		.then(activists =>
				this.setState({activists}));
	ItemService.getCurrFilters()
		.then(currFilters =>
				this.setState({currFilters}));
}

render() {
	const itemChilds = this.state.activists.map(activist =>
		<tr key={activist._id} style={style['list-table-row']}>
			<td style={style['list-table-field']}>{activist.firstname}</td>
			<td style={style['list-table-field']}>{activist.lastname}</td>
			<td style={style['list-table-field']}>{activist.city}</td>
			<td style={style['list-table-field']}>{activist.phone}</td>
			<td style={style['list-table-field']}>{activist.email}</td>
		</tr>);
	const stylesheet = `
				body{
					margin: 0;
					font-family: Cabin, sans-serif;
				}
				`;
	return (
		<div style={style["pageWrap"]}>
			<link
				href='http://fonts.googleapis.com/css?family=Cabin'
				rel='stylesheet'
				type='text/css'
			></link>
			<style>
				{stylesheet}
			</style>
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
							<label style={style['select-all-checkbox']}>
								<input style={{"opacity":0, "position":"absolute"}} type="checkbox"></input>
								<div style={style['checkbox']}><FontAwesomeIcon icon="check-square"></FontAwesomeIcon></div>
								SELECT ALL
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

}

