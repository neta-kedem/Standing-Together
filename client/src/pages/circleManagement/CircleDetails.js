import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import {faTrashAlt, faPenSquare} from '@fortawesome/free-solid-svg-icons'
library.add(faTrashAlt, faPenSquare);

export default class CircleDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			setName: props['setName'],
			setMailchimpList: props['setMailchimpList'],
			mailchimpLists: props['mailchimpLists'],
			rowIndex: props['rowIndex'],
		};
	}
	static getDerivedStateFromProps(nextProps, state) {
		if(!state.mailchimpLists.length && nextProps.mailchimpLists && nextProps.mailchimpLists.length) {
			return {mailchimpLists: nextProps.mailchimpLists};
		}
		return null;
	}

	setName=function(event){
		this.state.setName(event.target.value, this.state.rowIndex);
	}.bind(this);

	setMailchimpList=function(event){
		this.state.setMailchimpList(event.target.value, this.state.rowIndex);
	}.bind(this);

	render() {
		const rowValues = this.props.values;
		const mailchimpLists = this.state.mailchimpLists?this.state.mailchimpLists.slice():[];
		const mailchimpOptions = mailchimpLists.map((list)=>{
			return <option key={"circle_"+this.state.rowIndex+"_list_"+list.id} value={list.id}>{list.name}</option>;
		});
		return (
				<tr>
					<td>
						<input value={rowValues.name} type="text" onChange={this.setName}/>
					</td>
					<td>
						<select value={rowValues.mailchimpList || ""} onChange={this.setMailchimpList}>
							{mailchimpOptions}
							<option value=""> </option>
						</select>
					</td>
				</tr>
		);
	}
}