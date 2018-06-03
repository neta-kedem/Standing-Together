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
    return(
      <section style={style.wrapper}>
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
            <span style={style.valueNumber}>{this.props.condition.filterValue}</span>
          </div>
        </div>
      </section>
    )
  }

  getFilterValuePrefix(){
    const filterName = this.props.condition.filterName;
    if(filterName === "Lives") return "In ";

    return "";
  }
  getFilterIcon(){
    const filterName = this.props.condition.filterName;
    if(filterName === "Lives") return "fa fa-building";

    return "";
  }
}

export default SingleCondition;
