import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {faTrashAlt, faPenSquare} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faTrashAlt, faPenSquare);

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
	componentWillReceiveProps(nextProps) {
		if(!this.state.mailchimpLists.length&&nextProps.mailchimpLists&&nextProps.mailchimpLists.length) {
			this.setState({mailchimpLists: nextProps.mailchimpLists});
		}
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