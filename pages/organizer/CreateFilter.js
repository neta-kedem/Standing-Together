import React from 'react';
import Meta from '../../lib/meta';
import AddFiltersBtn from './AddFiltersBtn'

class CreateFilter extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			index: props.index,
			returnFilter: props.newFilter,
			filter:props.filter,
			show:props.isShow,
			newFilter: {}
		}
		this.getStringQuestions.bind(this)
	}

	componentWillReceiveProps(props) {
		this.setState({newFilter:{}})
	}

	getStringQuestions(){
		return this.state.filter.questions.map((question, j) => {
			let options = <input style={{marginLeft:10, border: "none"}} type="text" onClick={(ev)=>ev.stopPropagation()} onChange={(ev)=>this.setState({newFilter:{[question.label]:ev.target.value}})}/>
			if(['Is ', 'Is not '].includes(question.label) && this.state.filter.options) {
				options = (<div>
						<input style={{marginLeft:10, border: "none"}} type="text" name="options" list="options" onClick={(ev)=>ev.stopPropagation()} onChange={(ev)=>this.setState({newFilter:{[question.label]:ev.target.value}})}/>
							<datalist id="options" >
								{this.state.filter.options
								.map((option1, i) => (<option value={option1} key={i} />))}
							</datalist></div>
			)
			}
			return (
				<div key={j}>
					<div>{question.label}</div>
					{options}
				</div>)
		})
	}

	saveFilter(ev){
		this.state.returnFilter(this.state.newFilter)
		ev.preventDefault()
		ev.stopPropagation()
	}

	render() {
		const possibleFilters=this.state.filter.type === 'string' ? this.getStringQuestions(): (<div></div>);
		return(
				<section style={{background:"#F5E9EC", padding:"10px", borderRadius:"5%"}} className={this.props.show ? '' : 'hidden'}>
					{possibleFilters}
					<AddFiltersBtn text="Add Filter" type="single" saveFilter={this.saveFilter.bind(this)}/>

					<Meta/>
					<style global jsx>
						{`.hidden {
						display: none;
					}`}
					</style>
				</section>
		)
	}
}

export default CreateFilter;
