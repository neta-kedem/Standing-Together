import React from 'react';
import SingleCondition from './SingleCondition';
import style from './QueryCreator.css';
import AddFiltersBtn from './AddFiltersBtn';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTimes, faBuilding, faUserCircle, faUser, faPhone, faEnvelope, faCheckCircle } from '@fortawesome/fontawesome-free-solid';
fontawesome.library.add(faCalendarAlt, faTimes, faBuilding, faUserCircle, faUser, faPhone, faEnvelope, faCheckCircle);
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';
import ItemService from '../../services/ItemService'
import CreateFilter from './CreateFilter';

// icons
const orIcon = require('../../static/or.png');
const andIcon = require('../../static/and.png');


class QueryCreator extends React.Component {

  constructor(props){
		super(props);
    this.state = {
			currLogicalOperator: orIcon,
			isAddFilterBtnActive: false,
			isAddGroupBtnActive: false,
			currFilters: [],
			shownFilter: -1,
			newFilter: props.newFilter
		};

    ItemService.getCurrFilters().then((filters) => {
      this.state.currFilters = filters
    })

		// react-beautiful-dnd needs that in order to support server side rendering
		resetServerContext();
	}

	componentWillReceiveProps(nextProps) {
		// You don't have to do this check first, but it can help prevent an unneeded render
		if (nextProps.currFilters !== this.state.currFilters) {
			this.setState({ currFilters: nextProps.currFilters });
		}
	}
  _toggleLogicalOperator() {
    if(orIcon === this.state.currLogicalOperator) {
      this.setState({currLogicalOperator: andIcon})
    } else {
      this.setState({currLogicalOperator: orIcon})
    }
  }

  _addFilter() {
  	// this.setState()
  }

  _removeFilter(groupId, filterId){
    this.props.onRemoveFilter(groupId, filterId);
  }

  onDragStart(result){
		const oldIndex = result.source.index;
    const newIndex = result.destination.index;
    this.state.currFilters.splice(newIndex, 0, this.state.currFilters.splice(oldIndex, 1)[0]);
  }
	_exploreFilter(key){
  	if(this.state.shownFilter === key) this.setState({shownFilter:-1});
		else this.setState({shownFilter:key})

	}
	newFilter(lable, filter){
  	const newFilters = ItemService.addFilter(filter, lable);
		this.setState({currFilters:newFilters});
		this.state.newFilter(newFilters);
	}

  render() {
    const possibleFilters = this.state.currFilters.map((filter, key) => {
      return (<div onClick={this._exploreFilter.bind(this, key)} style={style["filter-title"]} key={key}>
				{/*<FontAwesomeIcon style={style["filter-icon"]} icon={filter.icon}/>{filter.label}*/}
				<div>
					<CreateFilter index={key} newFilter={this.newFilter.bind(this, filter.label)} filter={filter} show={this.state.shownFilter === key} />
				</div>
				</div>)
    })

    return(
      <section style={{overflow: "auto", height: "100%", "userSelect": "none"}}>

        <style global jsx>
          {`
          .filterIcon {
            width: 30px;
            height: 22px;
            cursor: pointer;
            user-select: none;
            user-drag: none;
          }
          @keyframes logicalOperatorClick {
            25% {transform: scale(1.5);}
            75% {transform: scale(1)}
          }
          .filterIcon:active {
            animation: logicalOperatorClick 1s;
            transition-timing-function: ease-in-out
          }
          `}
        </style>

				<DragDropContext onDragEnd={this.onDragStart.bind(this)}>
					<Droppable droppableId="droppable">
						{provided => (
								<Queries provided={provided} innerRef={provided.innerRef} {...provided.droppableProps}>
									{this.state.currFilters.map((filter, index) => {
										if(index) {return  (
												<div style={style.query} key={index}>
													<img className="filterIcon" src={this.state.currLogicalOperator} style={{alignSelf:"center"}} alt="logical operator" onMouseDown={() => this._toggleLogicalOperator()}/>
													<Draggable draggableId={index} index={index}>
													{provided => (
															<SingleCondition condition={filter} onClose={this._removeFilter.bind(this, 0, index)}
																							 provided={provided} innerRef={provided.innerRef} {...provided.draggableProps}
																							 {...provided.dragHandleProps}/>
													)}
													</Draggable>
													{provided.placeholder}
												</div>)}

										else {return  (
												<div style={style.query} key={index}>
													<Draggable draggableId={index} index={index}>
													{provided => (
															<SingleCondition condition={filter} onClose={this._removeFilter.bind(this, 0, index)}
																							 provided={provided} innerRef={provided.innerRef}/>
													)}
													</Draggable>
													{provided.placeholder}
												</div>)}
										})
									}

								</Queries>
						)}
					</Droppable>
				</DragDropContext>


        <AddFiltersBtn text="Add Filter" type="single" onClick={this._addFilter}></AddFiltersBtn>
        <AddFiltersBtn text="Add Group" type="group"></AddFiltersBtn>
        {possibleFilters}
      </section>
    )
  }




}


class Queries extends React.Component {
  render() {
    const { provided, innerRef, children } = this.props;
    return (
      <div {...provided.droppableProps} ref={innerRef}>
        {children}
      </div>
    );
  }
}



export default QueryCreator;
