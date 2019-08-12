import React from "react";
import QueryService from "../../services/queryService";
import "./QueryCreator.scss";
import AddFiltersBtn from "./AddFiltersBtn";
import {
  DragDropContext,
  Droppable,
  resetServerContext
} from "react-beautiful-dnd";
import GroupCondition from "./GroupCondition";
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCalendarAlt,
    faTimes,
    faBuilding,
    faUserCircle,
    faUser,
    faPhone,
    faEnvelope,
    faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
library.add(
    faCalendarAlt,
    faTimes,
    faBuilding,
    faUserCircle,
    faUser,
    faPhone,
    faEnvelope,
    faCheckCircle
);

// icons
const orIcon = "./static/or.png";
const andIcon = "./static/and.png";

class QueryCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddFilterBtnActive: false,
      isAddGroupBtnActive: false,
      currFilters: { logicalOperator:"or", groups: [] },
      showCreateFilterGroup: -1,
      avilableFilters: []
    };

    QueryService.getCurrFilters().then(filters => {
      this.state.currFilters = filters;
      this.props.changeCurrFilters(filters)
    });

    QueryService.getAvailableFilters().then(filters => {
      this.state.avilableFilters = filters;
    });

    // react-beautiful-dnd needs that in order to support server side rendering
    resetServerContext();
  }

  _toggleLogicalOperator(groupId, logicalOperator) {
    if ("or" === logicalOperator) {
      QueryService.setLogicalOperator(groupId, "and")
          .then(currFilters => {
            this.setState({ currFilters });
            this.props.changeCurrFilters(currFilters)
          })
    } else {
      QueryService.setLogicalOperator(groupId, "or")
          .then(currFilters => {
            this.setState({ currFilters });
            this.props.changeCurrFilters(currFilters)
          })
    }
  }

  _exploreFilter(key) {
    if (this.state.showCreateFilterGroup === key) this.setState({ showCreateFilterGroup: -1 });
    else this.setState({ showCreateFilterGroup: key });
  }

  _saveFilter(groupId, newFilter){
    QueryService.addFilter(groupId, newFilter)
        .then(currFilters => {
          this.setState({currFilters, showCreateFilterGroup: -1});
          this.props.changeCurrFilters(currFilters)
        })
  }

  _removeFilter(groupId, filterId) {
    QueryService.removeSingleFilter(groupId, filterId)
        .then(currFilters => {
          this.setState({ currFilters });
          this.props.changeCurrFilters(currFilters)
        }
    );
  }
  _addGroup() {
    QueryService.addGroup()
        .then(currFilters => {
          this.setState({ currFilters });
          this.props.changeCurrFilters(currFilters)
        }
    );
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
    let newGroupId = newId ? flatFilters[newId].groupId : 0;
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

    QueryService.setFilters(newCurrFilters);
    this.setState({ currFilters: newCurrFilters });
  }

  render() {
    return (
      <section style={{ overflow: "none", height: "calc(95% - 55px)", userSelect: "none" }}>
        <DragDropContext onDragEnd={this.onDragStart.bind(this)}>
          <Droppable droppableId="droppable">
            {provided => (
              <Queries
                provided={provided}
                innerRef={provided.innerRef}
                {...provided.droppableProps}
              >
                {this.state.currFilters.groups.map((group, groupId) => {
                  let queryEl = [];
                  if (groupId) {
                    queryEl.push(
                      <img
                        key={groupId}
                        className="filterIcon"
                        src={this.state.currFilters.logicalOperator === "or" ? orIcon : andIcon}
                        style={{
                          alignSelf: "center",
                          margin: "-12px 0 10px 0"
                        }}
                        alt="logical operator"
                        onMouseDown={() =>
                          this._toggleLogicalOperator(-1, this.state.currFilters.logicalOperator)
                        }
                      />
                    );
                  } else {
                    queryEl.push(
                      <div key={groupId} style={{ paddingTop: 20 }}/>
                    );
                  }
                  queryEl.push(
                    <GroupCondition
                      key={'group-'+groupId}
                      group={group}
                      groupId={groupId}
                      removeFilter={this._removeFilter.bind(this)}
                      provided={provided}
                      exploreFilter={this._exploreFilter.bind(this, groupId)}
                      hideNewFilters={this.state.showCreateFilterGroup !== groupId}
                      saveFilter={this._saveFilter.bind(this)}
                      toggleLogicalOperator={this._toggleLogicalOperator.bind(this, groupId)}
                    />
                  );
                  return (<div key={'group-'+groupId} style={Object.assign({padding: "0 10px", "border": "4px solid #90278e", borderRadius: '15px'}, groupId ? {borderTop: "none"} : {})}>{queryEl}</div>);
                })}
              </Queries>
            )}
          </Droppable>
        </DragDropContext>
        <AddFiltersBtn text="Add Group" type="group" onClick={this._addGroup.bind(this)}/>
      </section>
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
