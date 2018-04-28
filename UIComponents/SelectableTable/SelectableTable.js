import React from 'react';
import style from './SelectableTable.css'

import TextValue from './FieldTypes/TextValue'
import ToggleSwitch from './FieldTypes/ToggleSwitch'

import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {faPaperPlane, faCheckSquare, faUser, faPhone, faEnvelopeOpen, faCalendar, faCalendarCheck} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faPaperPlane, faCheckSquare, faUser, faPhone, faEnvelopeOpen, faCalendar, faCalendarCheck);

export default class SelectableTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: props.rows,
			header: props.header,
			allSelected: false
		};
	}
	
	/*required because the data is fetched asynchronously. Might not be the optimal solution.*/
	componentWillReceiveProps(nextProps){
		this.setState(
			{rows: nextProps.rows,
			header: nextProps.header}
		);
	}
	
	toggleAllRowsSelection() {
		const rows = this.state.rows.slice();
		for (var i=0; i<rows.length; i++)
		{this.setState({ data: [1, 2, 3] });

			rows[i].selected = !this.state.allSelected;
		}
		this.setState({rows: rows, allSelected: !this.state.allSelected});
	}

	toggleRowSelection(i) {
		const rows = this.state.rows.slice();
		rows[i].selected = !rows[i].selected;
		this.setState({rows: rows});
	}

	cellConstructor(type, val, onChangeFunction) {
		switch(type) {
			case 'text':
				return <TextValue value={val} handleChange={onChangeFunction}/>;
			case 'toggle':
			{
				return <ToggleSwitch value={val} handleChange={onChangeFunction}/>;
			}
			default:
				return <TextValue value={val} handleChange={onChangeFunction}/>;
		}
	}

	render() {
		const tableHeader = 
			<tr style={style['list-table-header']}>
				<td style={style['list-row-selection-indicator']}> </td>
				{this.state.header.map((field, i) =>
				<th key={i} style={style['list-table-header-field']}>
					{field.icon!=""?<FontAwesomeIcon icon={field.icon}></FontAwesomeIcon>:''}
					{" "+field.title}
				</th>)}
			</tr>;
		const rows =
			this.state['rows'].map((row, i) =>
				<tr key={i} style={{...style['list-table-row'],...style['list-table-field']}} onClick={() => this.toggleRowSelection(i)}>
					<td style={{...style['list-row-selection-indicator'], ...(row.selected?style['selected-table-row']:{})}}> </td>
					{
						this.state.header.map((field, j) =>
							<td key={j} style={style['list-table-field']} title={row[field["key"]]+""}>
								{this.cellConstructor(field["type"], row[field["key"]], function(value){field["handleChange"](i, value)},)}
							</td>
						)
					}
				</tr>);
		return (
			<div>
				<table style={style['list-table']}>
					<thead>
						{tableHeader}
					</thead>
					<tbody>
						{rows}
					</tbody>
				</table>
				<br></br>
				<div style={style['select-all-checkbox']} onClick={() => this.toggleAllRowsSelection()}>
					<div style={{...style['checkbox'],...(this.state.allSelected?style['checkbox-checked']:{})}}><FontAwesomeIcon icon="check-square"></FontAwesomeIcon></div>
					SELECT ALL
				</div>
			</div>
		)
	}
}