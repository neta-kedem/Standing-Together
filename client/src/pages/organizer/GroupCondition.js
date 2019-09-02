import React from "react";
import "./QueryCreator.scss";
import SingleCondition from "./SingleCondition";
import AddFiltersBtn from "./AddFiltersBtn";
import orIcon from "../../static/or.png";
import andIcon from "../../static/and.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class GroupCondition extends React.Component {
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
    this.state.toggleLogicalOperator()
  }

  render() {
    const {group, groupIndex} = this.props;
    const groupStr = [];
    groupStr.push(
      <div key={"remove-group"} className="remove-group" onClick={()=>{this.props.removeGroup(this.props.groupIndex)}}>
        <FontAwesomeIcon icon="times"/>
      </div>
    );
    groupStr.push(
       <div key={"conditions"}>
         {
           group.filters.map((condition, conditionIndex) => {
             return (
                <div key={conditionIndex} className={"single-condition-wrap"}>
                  <img
                      className={"filter-icon " + (conditionIndex === 0 ? "hidden " : "")}
                      src={!this.props.outerOr ? orIcon : andIcon}
                      alt="logical operator"
                      title={!this.props.outerOr ? "or" : "and"}
                      onMouseDown={() => this._toggleLogicalOperator()}
                  />
                  <SingleCondition
                      condition={condition}
                      conditionIndex={conditionIndex}
                      updateCondition={this.updateCondition.bind(this)}
                      filterableFields={this.props.filterableFields}
                      fieldsFilterOptions={this.props.fieldsFilterOptions}
                      removeCondition={() => this.state.removeCondition(groupIndex, condition.id)}
                  />
                </div>
             );
           })
         }
       </div>
    );
    groupStr.push(
      <AddFiltersBtn
        key={'btn' + groupIndex}
        text="Add Filter"
        type="single"
        onClick={()=>{this.addCondition()}}
      />
    );
    return (
        <div className="condition-group">
          {groupStr}
        </div>
    )
  }
}