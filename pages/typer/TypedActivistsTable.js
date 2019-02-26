import React from 'react';
import InputRow from './InputRow'
import style from './TypedActivistsTable.css'

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
		};
	}
	render() {
		const rows = this.props.activists.map((activist, i) =>
			{
				return <InputRow
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
					return <th key={"field_title_"+f.name}><h4>{f.ar}<br/>{f.he}</h4></th>
				})}
			</tr>;
		return (
			<div className="typed-table-wrap">
				<style jsx global>{style}</style>
				<table className={"typed-rows-table "+(this.props.highlightInvalidFields?"highlight-invalid-fields":"")}>
					<thead>
						{titleRow}
					</thead>
					{rows}
				</table>
			</div>
		);
	}
}
  