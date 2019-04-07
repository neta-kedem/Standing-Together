import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {faTrashAlt, faPenSquare} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faTrashAlt, faPenSquare);

export default class CityDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			setName: props['setName'],
			setDefaultCircle: props['setDefaultCircle'],
			circles: props['circles'],
			rowIndex: props['rowIndex'],
		};
	}
	componentWillReceiveProps(nextProps) {
		if(!this.state.circles.length&&nextProps.circles&&nextProps.circles.length) {
			this.setState({circles: nextProps.circles});
		}
	}

	setName=function(event){
		this.state.setName(event.target.value, this.state.rowIndex);
	}.bind(this);

	setDefaultCircle=function(event){
		this.state.setDefaultCircle(event.target.value, this.state.rowIndex);
	}.bind(this);

	render() {
		const rowValues = this.props.values;
		const circles = this.state.circles?this.state.circles.slice():[];
		const circleOptions = circles.map((circle)=>{
			return <option key={"circle_"+this.state.rowIndex+"_list_"+circle.name} value={circle.name}>{circle.name}</option>;
		});
		return (
				<tr>
					<td>
						<input value={rowValues.name} type="text" onChange={this.setName}/>
					</td>
					<td>
						<select value={rowValues.defaultCircle} onChange={this.setDefaultCircle}>
							{circleOptions}
							<option value=""> </option>
						</select>
					</td>
				</tr>
		);
	}
}