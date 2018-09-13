import React from 'react';
import styles from './InputRow.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faTrashAlt  } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faTrashAlt );

export default class InputRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			handlePost: props['handlePost'],
			handleChange: props['handleChange'],
			handleFocus: props['handleFocus'],
			handleDelete: props['handleDelete'],
			rowIndex: props['rowIndex'],
			isFocused: props['isFocused']
		};
		this.firstInput = React.createRef();
	}
	
	componentWillReceiveProps(nextProps) {
		if(nextProps.isFocused&&!this.state.isFocused) {
			this.firstInput.current.focus();
		}
		if(nextProps.isFocused!=this.state.isFocused){
			this.setState({isFocused: nextProps.isFocused});
		}
	}
	
	syncStateToInput=function(event){
		this.state.handleChange(event.target.name, event.target.value, this.state.rowIndex);
	}.bind(this);
	
	handleKeyPress=function(event){
		if(event.key == 'Enter' || event.key == 'Tab'){
			this.handlePost(this.state.rowIndex);
		}
	}.bind(this);
	
	handlePost = function(){
		//TODO: validate input here if needed
		this.state.handlePost(this.state.rowIndex);
	}.bind(this);
	
	handleFocus = function(){
		this.setState({isFocused: true}, ()=>{
			this.state.handleFocus(this.state.rowIndex)
		});
	}.bind(this);
	
	handleDelete = function(){
		this.state.handleDelete(this.state.rowIndex);
	}.bind(this);
	
	render() {
		return (
			<tbody className="row-wrap">
				<tr className="row-margin"><td/><td/><td/><td/><td/><td/></tr>
				<tr>
					<th className="delete-row-wrap">
						<FontAwesomeIcon className="delete-row" icon="trash-alt" onClick={this.handleDelete}/>
					</th>
					<td> 
						<input value={this.props.values.firstName} type="text" name="firstName" onChange={this.syncStateToInput} onFocus={this.handleFocus} ref={this.firstInput} autoFocus/>
					</td>
					<td> 
						<input value={this.props.values.lastName} type="text" name="lastName" onChange={this.syncStateToInput} onFocus={this.handleFocus}/>
					</td>
						<td> 
						<input value={this.props.values.city} type="text" name="city" onChange={this.syncStateToInput} onFocus={this.handleFocus}/>
					</td>
						<td> 
						<input value={this.props.values.phone} type="phone" name="phone" onChange={this.syncStateToInput} onFocus={this.handleFocus}/>
					</td>
					<td> 
						<input value={this.props.values.email} onKeyDown={this.handleKeyPress} type="email" name="email" onChange={this.syncStateToInput} onFocus={this.handleFocus}/>
					</td>
				</tr>
			<tr className="row-margin"><td/><td/><td/><td/><td/><td/></tr>
			</tbody>
		);
	}
}
  