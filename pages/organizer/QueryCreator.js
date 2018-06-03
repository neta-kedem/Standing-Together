import React from 'react';
import SingleCondition from './SingleCondition';
import style from './QueryCreator.css';
import AddFiltersBtn from './AddFiltersBtn';

// icons
const orIcon = require('../../static/or.png');
const andIcon = require('../../static/and.png');

class QueryCreator extends React.Component {

  state = {
    currLogicalOperator: orIcon,
    isAddFilterBtnActive: false,
    isAddGroupBtnActive: false,
  };

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

  render() {
    const conditions = this.props.currFilters.map((filterGroups, groupId) => {
      return filterGroups.map((filter, index) => {
        if(index) return <div style={style.query} key={filter.id}>
                          <img className="filterIcon" src={this.state.currLogicalOperator} alt="logical operator" onMouseDown={() => this._toggleLogicalOperator()}/>
                          <SingleCondition condition={filter} onClose={this._removeFilter.bind(this, groupId, index)}></SingleCondition>
                        </div>
        return  <div style={style.query} key={filter.id}>
                  <SingleCondition condition={filter} onClose={this._removeFilter.bind(this, groupId, index)}></SingleCondition>
                </div>
      });
    });

    return(
      <section style={{overflow: "auto", height: "100%"}}>

        <style jsx global>
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
        <div style={style.wrapper}>
            {conditions}
        </div>
        <AddFiltersBtn text="Add Filter" type="single" onclick={this._addFilter}></AddFiltersBtn>
        <AddFiltersBtn text="Add Group" type="group"></AddFiltersBtn>
      </section>
    )
  }
}

export default QueryCreator;
