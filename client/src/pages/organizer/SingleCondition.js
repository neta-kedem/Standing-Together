import React from 'react';
import './SingleCondition.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faTimes, faUserCircle } from '@fortawesome/free-solid-svg-icons';
library.add(faBuilding, faTimes, faUserCircle);
class SingleCondition extends React.Component {
  render() {
    const { provided, innerRef } = this.props;
    const newStyle = {};
    for (let style in provided.draggableProps.style) {
        newStyle[style] = provided.draggableProps.style[style];
    }
    return(
      <section
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={newStyle}
          ref={innerRef}
          className="single-condition-wrap"
      >
        <div className="titleRow">
          <div className="titleWrapper">
            <FontAwesomeIcon style={{padding:10}} icon={this.getFilterIcon()}/>
            <div>
              <div className="heading">{this.props.condition.filterName}</div>
            </div>
          </div>
          <div className="closeIcons" onClick={this.props.removeFilter}>
            <FontAwesomeIcon icon="times"/>
          </div>
        </div>
        <br/>
        <div className="valueContainer">
          <div className="iconWrapper">
            <span className="valuePrefix">{this.getFilterValuePrefix()}</span>
            <span>{this.props.condition.filterMain}</span>
          </div>
          <div>
            {/*<span style={styles.valueNumber}>{this.props.condition.filterValue}</span>*/}
          </div>
        </div>
      </section>
    )
  }

  getFilterValuePrefix(){
    // const filterName = this.props.condition.filterName;
    // if(filterPrefix === "filterPrefix") return "In ";

    return this.props.condition.filterPrefix;
  }
  getFilterIcon(){
    const filterName = this.props.condition.filterName;
    if(filterName === "מגורים") return "building";
    if(filterName === "שם מלא") return "user-circle";
    if(filterName === "מעגל") return "building";
    if(filterName === "שם פרטי") return "user-circle";
    if(filterName === "שם משפחה") return "user-circle";

    return "";
  }
}

export default SingleCondition;
