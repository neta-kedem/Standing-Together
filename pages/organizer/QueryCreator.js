import React from 'react';
import SingleCondition from './SingleCondition';
import style from './QueryCreator.css'

// icons
let orIcon, andIcon;
if('production' === process.env.NODE_ENV) {
  orIcon = require('/static/OR.png');
  andIcon = require('/static/AND.png');
} else {
  orIcon = require('../../static/OR.png');
  andIcon = require('../../static/AND.png');
}



class QueryCreator extends React.Component {

  state = {currlogicalOperator: orIcon};

  _toggleLogicalOperator(){
    if(orIcon === this.state.currlogicalOperator) {
      this.setState({currlogicalOperator: andIcon})
    } else {
      this.setState({currlogicalOperator: orIcon})
    }
  }
    render() {
        const conditions = this.props.currFilters.map((filter, index) => {
            if(index) return <div style={style.query} key={filter.id}>
                <img style={style.filterIcon} src={this.state.currlogicalOperator} alt="logical operator" onClick={() => this._toggleLogicalOperator()}/>
                    <SingleCondition condition={filter}></SingleCondition>
                </div>
            return <div style={style.query} key={filter.id}>
                    <SingleCondition condition={filter}></SingleCondition>
                </div>
        });
        return(
            <section style={{overflow: "auto", height: "100%"}}>
                <div style={style.wrapper}>
                    {conditions}
                </div>
            </section>
        )
    }
}

export default QueryCreator;
