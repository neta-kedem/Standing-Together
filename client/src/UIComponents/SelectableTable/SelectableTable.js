import React from 'react';
import './SelectableTable.scss'

import TextValue from './FieldTypes/TextValue'
import ToggleSwitch from './FieldTypes/ToggleSwitch'

import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
	faCalendar,
	faCalendarCheck,
	faCheckSquare,
	faEnvelopeOpen,
	faPaperPlane,
	faPhone,
	faPhoneSquare,
	faUser
} from '@fortawesome/free-solid-svg-icons'

library.add(faPaperPlane, faCheckSquare, faUser, faPhone, faEnvelopeOpen, faCalendar, faCalendarCheck, faPhoneSquare);

export default class SelectableTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			displayBorderTop: false, //when scrolling down the table, this border makes it look better. But if scrollTop == 0 it doesn't.
			rows: props.rows,
			rowKey: props.rowKey,
			header: props.header,
			singleSelection: props.singleSelection,
			onSelect: props.onSelect,
			onDoubleClick: props.onDoubleClick,
			allSelected: false
		};
		this.tableHead = React.createRef();
		this.tableBody = React.createRef();
	}

	static getDerivedStateFromProps(nextProps){
		return {
			rows: nextProps.rows,
			header: nextProps.header
		};
	}

	toggleAllRowsSelection() {
		const rows = this.state.rows.slice();
		for (let i = 0; i < rows.length; i++)
		{
			rows[i].selected = !this.state.allSelected;
		}
		this.setState({rows: rows, allSelected: !this.state.allSelected});
	}

	toggleRowSelection(rowIndex) {
		const rows = this.state.rows.slice();
		//deselect all rows, if the table is limited to a single selection
		if(this.state.singleSelection)
		{
			for(let i = 0; i < rows.length; i++)
			{
				rows[i].selected=false;
			}
		}
		rows[rowIndex].selected = !rows[rowIndex].selected;
		this.setState({rows: rows});
		if(this.state.onSelect)
			this.state.onSelect(rowIndex);
	}
	onDoubleClick(rowIndex) {
		this.state.onDoubleClick(this.state.rows.slice()[rowIndex])
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

	handleTableBodyScroll = function(e){
		this.tableHead.current.scrollLeft = e.currentTarget.scrollLeft;
		if(e.currentTarget.scrollTop > 4 && !this.state.displayBorderTop){
			this.setState({displayBorderTop: true})
		}
		if(e.currentTarget.scrollTop <= 4 && this.state.displayBorderTop){
			this.setState({displayBorderTop: false})
		}
	}.bind(this);

	render() {
		const tableHeader =
			<tr className='list-table-header'>
				<th className='list-row-selection-indicator list-table-header-field'> </th>
				{this.state.header.map((field, i) =>
				<th key={i} className={'list-table-header-field '+(!field.visibility?'hidden ':' ')}
					style={{
						'width': (field.width ? field.width : 'auto'),
						'minWidth': (field.width ? field.width : 'auto'),
						'maxWidth': (field.width ? field.width : 'auto')
					}}
				>
					{field.icon !== ""?
						<div className="list-table-header-icon">
							<FontAwesomeIcon icon={field.icon}/>
						</div>
					:''}
					<div className="list-table-header-titles">
						{field.title.map((title, j)=>
							<div key={j}>{title}</div>
						)}
					</div>
				</th>)}
			</tr>;
		const rows =
			this.state['rows'].map((row, i) =>
				<tr key={this.state.rowKey?row[this.state.rowKey]:i} className='list-table-row' onClick={() => this.toggleRowSelection(i)} onDoubleClick={()=>this.onDoubleClick(i)}>
					<td className={'list-table-field list-row-selection-indicator '+(row.selected?'selected-table-row ':'')}> </td>
					{
						this.state.header.map((field, j) =>
							<td key={j}
								className={'list-table-field ' + (!field.visibility ? 'hidden ' : ' ') + (field.noPadding ? 'no-padding ' : '')}
								style={{
									'width': (field.width ? field.width : 'auto'),
									'minWidth': (field.width ? field.width : 'auto'),
									'maxWidth': (field.width ? field.width : 'auto')
									}}
								title={row[field["key"]]+""}>
								{this.cellConstructor(field["type"], row[field["key"]], function(value){field["handleChange"](i, value)},)}
							</td>
						)
					}
				</tr>);
		/*const selectAll =
			<div className='select-all-checkbox' onClick={() => this.toggleAllRowsSelection()}>
				<div className={'checkbox '+(this.state.allSelected?'checkbox-checked':'')}><FontAwesomeIcon icon="check-square"> </FontAwesomeIcon></div>
				<div className="checkbox-label">
					<div>اختر الكل</div>
					<div>סימון הכל</div>
				</div>
			</div>;*/
		return (
			<div className={'list-table-wrap'}>
				<table className={'list-table'}>
					<thead ref={this.tableHead}>
						{tableHeader}
					</thead>
					<tbody
						ref={this.tableBody}
						style={{
							borderTop: this.state.displayBorderTop ? "1px solid #888" : "none"
						}}
						onScroll={this.handleTableBodyScroll}
					>
						{rows}
					</tbody>
				</table>
				{/*this.state.singleSelection?'':selectAll*/}
			</div>
		);
	}
}
