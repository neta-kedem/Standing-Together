import React from 'react';
import server from '../services/server';

import SelectableTable from '../UIComponents/SelectableTable/SelectableTable'
import MultiSelect from '../UIComponents/MultiSelect/MultiSelect'
import HamburgerMenu from '../UIComponents/HamburgerMenu/HamburgerMenu'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar'
import FilterFields from './organizer/FilterFields'
import QueryCreator from './organizer/QueryCreator'
import QueryResultsActionMenu from './organizer/QueryResultsActionMenu'
import PageNav from "../UIComponents/PageNav/PageNav";
import FileSaver from 'file-saver';
import './organizer/Organizer.scss'
import LoadSpinner from "../UIComponents/LoadSpinner/LoadSpinner";
import QueryString from "query-string";


export default class Organizer extends React.Component {
constructor(props) {
	super(props);
	const search = QueryString.parse(props.location.search, { ignoreQueryPrefix: true }).search;
	this.state = {
		query: "",
		page: 0,
		pageCount: 1,
		activistCount: 0,
		events: [],
		activists: [],
		loadingActivists: false,
		sortBy: null,
		sortOptions: FilterFields.sortOptions,
		fieldsFilterOptions: FilterFields.fieldsFilterOptions,
		filterableFields: FilterFields.filterableFields,
		currFilters: search?JSON.parse(search):{
			outerOr: true,
			groups: [
				{
					filters: [
						{}
					]
				}
			]
		},
		allSelected: false,
		tableFields:[
			{title: ["اسم", "שם"],  visibility: true, key: "name", icon:"user", type:"text", width:"15em"},
			{title: ["البلد", "עיר"],  visibility: true, key: "city", icon:"building", type:"text", width:"12em"},
			{title: ["رقم الهاتف", "טלפון"],  visibility: true, key: "phone", icon:"phone", type:"text", width:"12em"},
			{title: ["البريد الإلكتروني", "אימייל"],  visibility: true, key: "email", icon:"envelope-open", type:"text", width:"15em"},
			{title: ["اخر ظهور", "נראתה לאחרונה"],  visibility: false, key: "lastSeen", icon:"calendar", type:"text", width:"12em"},
			{title: ["اخر حدث", "אירוע אחרון"],  visibility: false, key: "lastEvent", icon:"calendar-check", type:"text", width:"8em"},
		],
	};
}

componentDidMount() {
	FilterFields.mount();

}

handleQueryChange(query, sortBy) {
	this.setState({query: query, sortBy:sortBy}, () => {
		this.fetchActivistsByQuery();
	});
}

fetchActivistsByQuery(){
	const query = this.state.query;
	const sortBy = this.state.sortBy;
	const page = this.state.page;
	this.setState({loadingActivists: true});
	server.post('selectActivists', {'query': query, 'sortBy': sortBy, 'page': page})
		.then(json => {
			if(json && json.activists) {
				this.setState({
					activists: json.activists,
					pageCount: json.pageCount,
					activistCount: json.activistCount,
					loadingActivists: false
				});
				this.props.history.push('/Organizer?search='+JSON.stringify(this.state.currFilters));
			}
		});
}

downloadActivistsByQuery(){
	const query = this.state.query;
	const sortBy = this.state.sortBy;
	server.post('queryToXLSX', {'query': query, 'sortBy': sortBy})
		.then(json => {
			const blob = new Blob(["\uFEFF" + json.csv], {type: "text/csv;charset=utf-8,%EF%BB%BF"});
			FileSaver.saveAs(blob, "contacts_export.csv");
		});
}


handlePageNavigation(page){
	this.setState({page: page}, ()=>{
		this.fetchActivistsByQuery();
	});
}
handleFieldDisplayToggle(fieldIndex, status){
	const tableFields = this.state.tableFields.slice();
	tableFields[fieldIndex].visibility=status;
	this.setState({tableFields: tableFields});
}
goToActivistPage(activist){
	this.props.history.push('/Activist?id='+activist._id);
}
render() {
	const currPage = this.state.page;
	const pageCount = this.state.pageCount;
	const activistCount = this.state.activistCount;
	const loadingActivists = this.state.loadingActivists;
	const tableFieldsMultiSelect = <MultiSelect
		values={this.state.tableFields}
		label='key'
		selection='visibility'
		handleChange={this.handleFieldDisplayToggle.bind(this)}/>;
	const tableFieldsDropdown = <HamburgerMenu content={tableFieldsMultiSelect}/>;
	return (
		<div className="page-wrap page-wrap-organizer" dir="rtl">
			<TopNavBar>
				<div className="title-wrap">
					<span className="title-lang">ادارة جهات اتصال</span>
					<span className="title-lang">ניהול אנשי קשר</span>
				</div>
			</TopNavBar>
			<div className="content-wrap">
				<div className="left-panel">
					<QueryCreator
						changeCurrFilters={this.handleQueryChange.bind(this)}
						initFilters={this.state.currFilters}
						sortOptions={this.state.sortOptions}
						filterableFields={this.state.filterableFields}
						fieldsFilterOptions={this.state.fieldsFilterOptions}
					/>
					<br/>
					<div className="textual-query">
						{/*this.state.query*/}
					</div>
				</div>
				<div className="main-panel">
					<QueryResultsActionMenu
						items={[{"content": tableFieldsDropdown, "alignToEnd": true}]}
						activistCount={activistCount}
						downloadActivistsByQuery={this.downloadActivistsByQuery.bind(this)}
					/>
					<div className="results-wrap">
						<div className="query-results">
							<SelectableTable rows={this.state.activists} rowKey="_id" header={this.state.tableFields} onDoubleClick={this.goToActivistPage.bind(this)}/>
							<div className="loading-query-wrap">
								<LoadSpinner visibility={loadingActivists}/>
							</div>
							<PageNav currPage={currPage} pageCount={pageCount} goToPage={this.handlePageNavigation.bind(this)}/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
}