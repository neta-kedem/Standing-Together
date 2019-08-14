import React from "react";
import QueryService from "../../services/queryService";
import "./QueryCreator.scss";
import AddFiltersBtn from "./AddFiltersBtn";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import GroupCondition from "./GroupCondition";
import orIcon from "../../static/or.png";
import andIcon from "../../static/and.png";
import { library } from '@fortawesome/fontawesome-svg-core';
import {faCalendarAlt, faTimes, faBuilding, faUserCircle, faUser, faPhone, faEnvelope, faCheckCircle} from "@fortawesome/free-solid-svg-icons";
library.add(faCalendarAlt, faTimes, faBuilding, faUserCircle, faUser, faPhone, faEnvelope, faCheckCircle);

class QueryCreator extends React.Component {
  constructor(props) {
      super(props);
      let initFilters = this.props.initFilters || QueryService.addGroup();
      QueryService.updateFilterIndices(initFilters);
    this.state = {
        changeCurrFilters: this.props.changeCurrFilters,
        currFilters: initFilters
    };
  }

  componentDidMount() {
      this.updateQuery();
  }

  updateQuery(){
      this.state.changeCurrFilters(QueryService.generateQuery(this.state.currFilters, this.props.filterableFields))
  }

  _toggleLogicalOperator() {
      const currFilter = this.state.currFilters;
      currFilter.outerOr = !currFilter.outerOr;
      this.setState({currFilter}, ()=>{
          this.updateQuery();
      });
  }

  _addCondition(groupIndex){
    const currFilters = QueryService.addCondition(this.state.currFilters, groupIndex);
    this.setState({currFilters});
    this.updateQuery()
  }

  _updateCondition(condition, groupIndex, conditionIndex){
      const currFilters = QueryService.updateCondition(condition, this.state.currFilters, groupIndex, conditionIndex);
      this.setState({currFilters});
      this.updateQuery()
  }

  _removeCondition(groupIndex, conditionIndex) {
    const currFilters = QueryService.removeCondition(this.state.currFilters, groupIndex, conditionIndex);
    this.setState({ currFilters });
    this.updateQuery()
  }
  _addGroup() {
      const currFilters = QueryService.addGroup(this.state.currFilters);
      this.setState({ currFilters });
      this.updateQuery()
  }
  _removeGroup(groupIndex) {
      const currFilters = QueryService.removeGroup(this.state.currFilters, groupIndex);
      this.setState({ currFilters });
      this.updateQuery()
  }

  onDragStart(result) {
    // todo neta- should be in the service
    if (!result.destination) return;
    const oldId = result.source.index;
    let newId = result.destination.index;

    let flatFilters = [];
    this.state.currFilters.groups.forEach((group, groupId) =>
      group
        ? group.filters.forEach(filter => {
            filter.groupId = groupId;
            flatFilters.push(filter);
          })
        : null
    );
    newId = Math.min(flatFilters.length - 1, newId);
    let newGroupId = (flatFilters[newId] && newId) ? flatFilters[newId].groupId : 0;
    let filterMoved = flatFilters.splice(oldId, 1);
    filterMoved[0].groupId = newGroupId;
    flatFilters.splice(newId, 0, filterMoved[0]);

    let newCurrFilters = {
      logicalOperator: this.state.currFilters.logicalOperator,
      groups: []
    };

    flatFilters.forEach((filter, id) => {
      filter.id = id;
      let group = newCurrFilters.groups[filter.groupId];
      if (!group) newCurrFilters.groups[filter.groupId] = {filters: [], logicalOperator: this.state.currFilters.groups[filter.groupId].logicalOperator};
      newCurrFilters.groups[filter.groupId].filters.push(filter);
    });

    newCurrFilters.groups = newCurrFilters.groups.filter(group => group.filters.length);
    this.setState({ currFilters: newCurrFilters });
  }

  render() {
    return (
      <div>
        <DragDropContext onDragEnd={this.onDragStart.bind(this)}>
          <Droppable droppableId="droppable">
            {provided => (
              <Queries
                provided={provided}
                innerRef={provided.innerRef}
                {...provided.droppableProps}
              >
                {this.state.currFilters.groups.map((group, groupIndex) => {
                  let queryEl = [];
                  if (groupIndex) {
                    queryEl.push(
                      <img
                        key={groupIndex}
                        className="filter-icon"
                        src={this.state.currFilters.outerOr ? orIcon : andIcon}
                        alt="logical operator"
                        onMouseDown={() =>
                          this._toggleLogicalOperator()
                        }
                      />
                    );
                  }
                  queryEl.push(
                    <GroupCondition
                      key={'group-'+groupIndex}
                      group={group}
                      groupIndex={groupIndex}
                      removeGroup={this._removeGroup.bind(this)}
                      addCondition={this._addCondition.bind(this)}
                      updateCondition={this._updateCondition.bind(this)}
                      removeCondition={this._removeCondition.bind(this)}
                      toggleLogicalOperator={this._toggleLogicalOperator.bind(this)}
                      outerOr={this.state.currFilters.outerOr}
                      filterableFields={this.props.filterableFields}
                      fieldsFilterOptions={this.props.fieldsFilterOptions}
                      provided={provided}
                    />
                  );
                  return (<div key={'group-'+groupIndex} className={"condition-group-wrap"}>{queryEl}</div>);
                })}
              </Queries>
            )}
          </Droppable>
        </DragDropContext>
        <AddFiltersBtn text="Add Group" type="group" onClick={this._addGroup.bind(this)}/>
      </div>
    );
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
