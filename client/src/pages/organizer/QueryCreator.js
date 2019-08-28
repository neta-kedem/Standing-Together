import React from "react";
import QueryService from "../../services/queryService";
import AddFiltersBtn from "./AddFiltersBtn";
import GroupCondition from "./GroupCondition";
import QueryLoader from './QueryLoader'
import orIcon from "../../static/or.png";
import andIcon from "../../static/and.png";
import "./QueryCreator.scss";
class QueryCreator extends React.Component {
  constructor(props) {
      super(props);
      let initFilters = this.props.initFilters || QueryService.addGroup();
      QueryService.updateFilterIndices(initFilters);
    this.state = {
        changeCurrFilters: this.props.changeCurrFilters,
        currFilters: initFilters,
        sortOptions: this.props.sortOptions
    };
  }

  componentDidMount() {
      this.updateQuery();
  }

  updateQuery(){
      this.state.changeCurrFilters(QueryService.generateQuery(this.state.currFilters, this.props.filterableFields), this.state.currFilters.sortBy)
  }

  setFilters(filters){
      this.setState({currFilters: filters}, ()=>{
          this.updateQuery();
      })
  }

  setSortingField(field){
      const currFilter = this.state.currFilters;
      currFilter.sortBy = field;
      this.setState({currFilter}, ()=>{
          this.updateQuery();
      });
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
          <QueryLoader currFilters={this.state.currFilters} setFilters={this.setFilters.bind(this)}/>
          {
             this.state.currFilters.groups.map((group, groupIndex) => {
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
                 />
               );
               return (
                   <div key={'group-' + groupIndex} className={"condition-group-wrap"}>
                       {queryEl}
                   </div>
               );
             })
          }
        <AddFiltersBtn text="Add Group" type="group" onClick={this._addGroup.bind(this)}/>
        <div className={"query-sorting-wrap"}>
            <label className={"query-sorting-label"} htmlFor="select-sort-by">סידור תוצאות לפי · סידור תוצאות לפי</label>
            <select className={"query-sorting"} id="select-sort-by" value={this.state.currFilters.sortBy} onChange={(e)=>{this.setSortingField(e.target.value)}}>
                {
                    this.state.sortOptions.map(f => {
                        return <option key={"sort-by-" + f.key} value={f.key}>{f.label}</option>
                    })
                }
            </select>
        </div>
      </div>
    );
  }
}

export default QueryCreator;
