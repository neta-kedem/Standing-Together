import React from 'react';
//import styles from './SingleCondition.scss';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faTimes, faUserCircle } from '@fortawesome/free-solid-svg-icons';
library.add(faBuilding, faTimes, faUserCircle);
const styles={};
class SingleCondition extends React.Component {
  render() {
		const { provided, innerRef } = this.props;
    const newStyle = {};
		for (let style in provided.draggableProps.style) {
      newStyle[style] = provided.draggableProps.style[style]
    }
		return(
      <section
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={Object.assign(newStyle, styles.wrapper)}
					ref={innerRef}>
        <div style={styles.titleRow}>
          <div style={styles.titleWrapper}>
            <FontAwesomeIcon style={{padding:10}} icon={this.getFilterIcon()}></FontAwesomeIcon>
            <div>
              <div style={styles.heading}>{this.props.condition.filterName}</div>
            </div>
          </div>
          <div style={styles.closeIcons} onClick={this.props.removeFilter}>
            <FontAwesomeIcon icon="times"></FontAwesomeIcon>
          </div>
        </div>
        <br/>
        <div style={styles.valueContainer}>
          <div style={styles.iconWrapper}>
            <span style={styles.valuePrefix}>{this.getFilterValuePrefix()}</span>
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
    if(filterName === "מעגל") return "circle";
    if(filterName === "שם פרטי") return "user-circle";
    if(filterName === "שם משפחה") return "user-circle";

    return "";
  }
}

export default SingleCondition;
