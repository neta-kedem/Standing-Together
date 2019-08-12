import React from "react";
import style from "./QueryCreator.scss";
import {Draggable, resetServerContext} from 'react-beautiful-dnd'
import SingleCondition from "./SingleCondition";
import AddFiltersBtn from "./AddFiltersBtn";
import QueryService from '../../services/queryService'
import CreateFilter from './CreateFilter'
import orIcon from "../../static/or.png";
import andIcon from "../../static/and.png";

class GroupCondition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.group || {logicalOperator: "or", currFilters: []}
    };

    QueryService.getCurrFilters().then(group => {
      this.setState(group)
    });

    // react-beautiful-dnd needs that in order to support server side rendering
    resetServerContext();
  }

  static getDerivedStateFromProps(nextProps) {
      return {group: nextProps.group};
  }

  addFilter(groupId, filterId){
    this.props.addFilter(groupId, filterId)
  }

  _toggleLogicalOperator() {
    this.props.toggleLogicalOperator(this.state.group.logicalOperator)
  }
  render() {
    const {group, groupId, provided} = this.props;
    const groupStr = [];

    const possibleFilters = (
        <div hidden={this.props.hideNewFilters} style={{marginBottom: 10}} key={'newFilter' + groupId}>
          <CreateFilter
              saveFilter={(newFilter) => this.props.saveFilter(groupId, newFilter)}
          />
        </div>
    );

    groupStr.push(
      group.filters.map((filter, index) => {
        if (index) {
          return (
            <div style={style.query} key={index}>
              <img
                className="filterIcon"
                src={this.state.group.logicalOperator === "or" ? orIcon : andIcon}
                style={{ alignSelf: "center" }}
                alt="logical operator"
                onMouseDown={() => this._toggleLogicalOperator()}
              />
              <Draggable draggableId={filter.id} index={filter.id}>
                {provided => (
                  <SingleCondition
                    condition={filter}
                    removeFilter={() =>this.props.removeFilter(groupId, filter.id)}
                    provided={provided}
                    innerRef={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  />
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          );
        } else {
          return (
            <div style={style.query} key={index}>
              <Draggable draggableId={filter.id} index={filter.id}>
                {provided => (
                  <SingleCondition
                    condition={filter}
                    removeFilter={() => this.props.removeFilter(groupId, filter.id)}
                    provided={provided}
                    innerRef={provided.innerRef}
                  />
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          );
        }
      })
    );
    groupStr.push(
      <AddFiltersBtn
        key={'btn' + groupId}
        text="Add Filter"
        type="single"
        onClick={this.props.exploreFilter}
      />
    );
    groupStr.push(possibleFilters);
    return (<div>{groupStr}</div>)
  }
}

export default GroupCondition;
