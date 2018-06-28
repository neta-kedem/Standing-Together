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
			currFilters: []
		};

    this.filters = ItemService.getPossibleFilters();

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
  }

  _removeFilter(groupId, filterId){
    this.props.onRemoveFilter(groupId, filterId);
  }

  onDragStart(result){
		const oldIndex = result.source.index;
    const newIndex = result.destination.index;
    this.state.currFilters.splice(newIndex, 0, this.state.currFilters.splice(oldIndex, 1)[0]);
  }

  render() {

    const possibleFilters = this.filters.map((filter, key) => {
      return <div style={style["filter-title"]} key={key}><FontAwesomeIcon style={style["filter-icon"]} icon={filter.icon} />{filter.label}</div>
    })

    return(
      <section style={{overflow: "auto", height: "100%"}}>

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


        <AddFiltersBtn text="Add Filter" type="single" onclick={this._addFilter}></AddFiltersBtn>
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
