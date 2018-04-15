import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Meta from '../lib/meta';

import TopNavBar from './organizer/TopNavbar'
import ItemService from '../services/ItemService'
import QueryCreator from './organizer/QueryCreator'
import SelectableTable from './organizer/SelectableTable'
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

	const stylesheet = `
				body{
					margin: 0;
					font-family: Cabin, sans-serif;
				}
				`;
	return (
		<div style={style["pageWrap"]}>
			<link
				href='https://fonts.googleapis.com/css?family=Cabin'
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
							<SelectableTable rows={this.state.activists} header={[
								{title: "First Name", key: "firstname", icon:"user"},
								{title: "Last Name", key: "lastname", icon:"user"},
								{title: "Lives In", key: "city", icon:"building"},
								{title: "Phone", key: "phone", icon:"phone"},
								{title: "Email", key: "email", icon:"envelope-open"}
							]}></SelectableTable>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

}

