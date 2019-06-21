import React from 'react';
import style from './SingleCondition.css';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faBuilding, faTimes } from '@fortawesome/fontawesome-free-solid';
fontawesome.library.add(faBuilding, faTimes);

class SingleCondition extends React.Component {
  _removeFilter(){
    this.props.onClose();

  }
  render() {
		const { provided, innerRef } = this.props;
    const newStyle = {};
		for (let bla in provided.draggableProps.style) {
      newStyle[bla] = provided.draggableProps.style[bla]
    }
		return(
      <section
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={Object.assign(newStyle, style.wrapper)}
					ref={innerRef}>
        <div style={style.titleRow}>
          <div style={style.titleWrapper}>
            {/*<span className={this.getFilterIcon()} style={style.filterIcon} aria-hidden="true"></span>*/}
            <FontAwesomeIcon icon="building"></FontAwesomeIcon>
            <div>
              <div style={style.heading}>{this.props.condition.filterName}</div>
            </div>
          </div>
          <div style={style.closeIcons} onClick={this._removeFilter.bind(this)}>
            <FontAwesomeIcon icon="times"></FontAwesomeIcon>
          </div>
        </div>
        <br/>
        <div style={style.valueContainer}>
          <div style={style.iconWrapper}>
            <span style={style.valuePrefix}>{this.getFilterValuePrefix()}</span>
            <span>{this.props.condition.filterMain}</span>
          </div>
          <div>
            {/*<span style={style.valueNumber}>{this.props.condition.filterValue}</span>*/}
          </div>
        </div>
      </section>
    )
  }

  getFilterValuePrefix(){
    const filterName = this.props.condition.filterName;
    // if(filterName === "Residency") return "In ";

    return this.props.condition.prefix;
  }
  getFilterIcon(){
    const filterName = this.props.condition.filterName;
    if(filterName === "Residency") return "fa fa-building";

    return "";
  }
}

export default SingleCondition;
