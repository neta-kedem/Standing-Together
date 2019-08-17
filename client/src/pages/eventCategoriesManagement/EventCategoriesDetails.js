import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import {faTrashAlt, faPenSquare} from '@fortawesome/free-solid-svg-icons'
library.add(faTrashAlt, faPenSquare);

export default class EventCategoriesDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			setHe: props['setHe'],
			setAr: props['setAr'],
			rowIndex: props['rowIndex']
		};
	}

	setHe=function(event){
		this.state.setHe(event.target.value, this.state.rowIndex);
	}.bind(this);

	setAr=function(event){
		this.state.setAr(event.target.value, this.state.rowIndex);
	}.bind(this);

	render() {
		const rowValues = this.props.values;
		return (
				<tr>
					<td>
						<input value={rowValues.name.he} type="text" onChange={this.setHe}/>
					</td>
					<td>
						<input value={rowValues.name.ar} type="text" onChange={this.setAr}/>
					</td>
				</tr>
		);
	}
}