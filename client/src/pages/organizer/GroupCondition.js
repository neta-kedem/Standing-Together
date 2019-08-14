import React from "react";
import "./QueryCreator.scss";
import {Draggable} from 'react-beautiful-dnd'
import SingleCondition from "./SingleCondition";
import AddFiltersBtn from "./AddFiltersBtn";
import orIcon from "../../static/or.png";
import andIcon from "../../static/and.png";

class GroupCondition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.group,
      updateCondition: this.props.updateCondition,
      addCondition: this.props.addCondition,
      removeCondition: this.props.removeCondition,
      toggleLogicalOperator: this.props.toggleLogicalOperator
    };
  }

  static getDerivedStateFromProps(nextProps) {
      return {group: nextProps.group};
  }

  addCondition(){
    this.state.addCondition(this.props.groupIndex)
  }

  updateCondition(condition, conditionIndex){
    this.state.updateCondition(condition, this.props.groupIndex, conditionIndex)
  }

  _toggleLogicalOperator() {
    this.state.toggleLogicalOperator(this.state.group.logicalOperator)
  }

  render() {
    const {group, groupIndex, provided} = this.props;
    const groupStr = [];
    groupStr.push(
      group.filters.map((condition, conditionIndex) => {
          return(
            <div className="query" key={conditionIndex}>
              <img
                className={"filter-icon " + (conditionIndex === 0 ? "hidden " : "")}
                src={this.state.group.logicalOperator === "or" ? orIcon : andIcon}
                alt="logical operator"
                onMouseDown={() => this._toggleLogicalOperator()}
              />
              <Draggable draggableId={condition.id} index={condition.id}>
                {provided => (
                  <SingleCondition
                      condition={condition}
                      conditionIndex={conditionIndex}
                      updateCondition={this.updateCondition.bind(this)}
                      filterableFields={this.props.filterableFields}
                      fieldsFilterOptions={this.props.fieldsFilterOptions}
                      removeCondition={() =>this.state.removeCondition(groupIndex, condition.id)}
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
      })
    );
    groupStr.push(
      <AddFiltersBtn
        key={'btn' + groupIndex}
        text="Add Filter"
        type="single"
        onClick={()=>{this.addCondition()}}
      />
    );
    return (<div>{groupStr}</div>)
  }
}

export default GroupCondition;
