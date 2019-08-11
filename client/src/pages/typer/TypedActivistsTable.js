import React from 'react';
import InputRow from './InputRow'
import style from './TypedActivistsTable.scss'

export default class TypedActivistsTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			handleChange: props['handleChange'],
			handleRowPost: props['handleRowPost'],
			handleRowFocus: props['handleRowFocus'],
			handleRowDeletion: props['handleRowDeletion'],
			handleRowEditToggle: props['handleRowEditToggle'],
			fields: props['fields'],
			dataLists: props['dataLists']
		};
	}
	render() {
		const rows = this.props.activists.map((activist, i) =>
			{
				return <InputRow
					dir="rtl"
					fields={this.state.fields}
					isFocused={i === this.props.selectedRow}
					handleFocus={this.state.handleRowFocus}
					handleChange={this.state.handleChange}
					handlePost={this.state.handleRowPost}
					handleDelete={this.state.handleRowDeletion}
					handleEditToggle={this.state.handleRowEditToggle}
					key={i} values={activist} rowIndex={i}/>
			});
		const titleRow =
			<tr>
				<th className="delete-row-wrap"> </th>
				{this.state.fields.map((f) => {
					return <React.Fragment key={"field_title_"+f.name}>
						{f.margin?<th className="col-margin"/>:null}
						<th>
							<h4>{f.ar}<br/>{f.he}</h4>
						</th>
						{f.margin?<th className="col-margin"/>:null}
					</React.Fragment>;
				})}
			</tr>;
		const dataLists = this.state.dataLists?
			this.state.dataLists.map((f)=>{
				return <datalist key={f.field+"-data-list"} id={f.field+"-data-list"}>
					{f.data.map((option)=>{
					return <option key={f.field+"-op-"+option} value={option}/>
				})}
				</datalist>
			})
			:"";
		return (
			<div className="typed-table-wrap">
				<table dir="rtl" className={"typed-rows-table "+(this.props.highlightInvalidFields?"highlight-invalid-fields":"")}>
					<thead>
						{titleRow}
					</thead>
				</table>
				<table dir="rtl" className={"typed-rows-table main-body "+(this.props.highlightInvalidFields?"highlight-invalid-fields":"")}>
					{rows}
				</table>
				{dataLists}
			</div>
		);
	}
}
  