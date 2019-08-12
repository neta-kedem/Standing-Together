import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import {faTrashAlt, faPenSquare} from '@fortawesome/free-solid-svg-icons'
library.add(faTrashAlt, faPenSquare);

export default class CityDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			setHeName: props['setHeName'],
			setArName: props['setArName'],
			setDefaultCircle: props['setDefaultCircle'],
			circles: props['circles'],
			rowIndex: props['rowIndex'],
		};
	}
	static getDerivedStateFromProps(nextProps, state) {
		if(!state.circles.length && nextProps.circles && nextProps.circles.length) {
			return{circles: nextProps.circles};
		}
	}

	setHeName=function(event){
		this.state.setHeName(event.target.value, this.state.rowIndex);
	}.bind(this);

	setArName=function(event){
		this.state.setArName(event.target.value, this.state.rowIndex);
	}.bind(this);

	setDefaultCircle=function(event){
		this.state.setDefaultCircle(event.target.value, this.state.rowIndex);
	}.bind(this);

	render() {
		const rowValues = this.props.values;
		const circles = this.state.circles?this.state.circles.slice():[];
		const circleOptions = circles.map((circle)=>{
			return <option key={"circle_"+this.state.rowIndex+"_list_"+circle.name} value={circle.name || ""}>{circle.name}</option>;
		});
		return (
				<tr>
					<td>
						<input value={rowValues.nameHe} type="text" onChange={this.setHeName}/>
					</td>
					<td>
						<input value={rowValues.nameAr} type="text" onChange={this.setArName}/>
					</td>
					<td>
						<select value={rowValues.defaultCircle || ""} onChange={this.setDefaultCircle}>
							<option value=""> </option>
							{circleOptions}
						</select>
					</td>
				</tr>
		);
	}
}