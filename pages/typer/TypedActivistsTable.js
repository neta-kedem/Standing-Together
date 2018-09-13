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
			handleRowDeletion: props['handleRowDeletion']
		};
	}
	render() {
		const rows = this.props.activists.map((activist, i) =>
			{
				return <InputRow isFocused={i==this.props.selectedRow} handleFocus={this.state.handleRowFocus} handleChange={this.state.handleChange} handlePost={this.state.handleRowPost} handleDelete={this.state.handleRowDeletion} key={i} values={activist} rowIndex={i}/>
			});
		const titleRow =
			<tr>
				<th className="delete-row-wrap"></th>
				<th>
					<h4>שם פרטי<br/>الاسم الشخصي</h4>
				</th>
				<th>
					<h4>שם משפחה<br/>اسم العائلة</h4>
				</th>
				<th>
					<h4>עיר<br/>البلد</h4>
				</th>
				<th>
					<h4>טלפון<br/>رقم الهاتف</h4>
				</th>
				<th>
					<h4>אימייל<br/>البريد الإلكتروني</h4>
				</th>
			</tr>
		return (
			<div className="typed-table-wrap">
				<style jsx global>{style}</style>
				<table className="typed-rows-table">
					<thead>
						{titleRow}
					</thead>
					{rows}
				</table>
			</div>
		);
	}
}
  