import React from 'react';
import './SingleCondition.scss';
import Popup from "../../UIComponents/Popup/Popup";
import CitySelector from "../../UIComponents/CitySelector/CitySelector";
import EventPicker from "../../UIComponents/EventPicker/EventPicker";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
library.add(faFilter, faTimes);
class SingleCondition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      condition: this.props.condition,
      conditionIndex: this.props.conditionIndex,
      group: this.props.group,
      updateCondition: this.props.updateCondition,
    };
  }

  static getDerivedStateFromProps(nextProps){
    return {
      condition: nextProps.condition,
      conditionIndex: nextProps.conditionIndex
    };
  }

  setConditionFieldType = function(fieldType){
    const condition = this.state.condition;
    condition.fieldType = fieldType;
    const field = this.props.filterableFields[fieldType];
    const fieldOptions = Object.keys(field.options)
        .map(o => {return {key: o, option: field.options[o]}})
        .sort((a, b) => (a.option.sortPosition - b.option.sortPosition));
    condition.option = fieldOptions[0].key;
    this.setState({condition}, ()=>{
      this.updateCondition();
    })
  }.bind(this);

  setConditionOption = function(option){
    const condition = this.state.condition;
    condition.option = option;
    this.setState({condition}, ()=>{
      this.updateCondition();
    })
  }.bind(this);

  setConditionValue = function(value, updateResults){
    const condition = this.state.condition;
    condition.value = value;
    this.setState({condition}, ()=>{
      if(updateResults !== false)
        this.updateCondition();
    })
  }.bind(this);

  updateCondition = function(){
    this.state.updateCondition(this.state.condition, this.state.conditionIndex);
  }.bind(this);

  getFieldSelector = function(){
    const filterableFields = this.props.filterableFields;
    const condition = this.state.condition;
    return <div>
      <div className="heading">
        <div className="condition-title-wrap">
          <div className="condition-icon">
            <FontAwesomeIcon icon="filter"/>
          </div>
          <div className="condition-title">
            בחירת שדה
          </div>
        </div>
        <div className="remove-condition" onClick={this.props.removeCondition}>
          <FontAwesomeIcon icon="times"/>
        </div>
      </div>
      <div className="condition-container">
        <select value={condition.fieldType} onChange={(e)=>{this.setConditionFieldType(e.target.value)}} className="field-select">
          <option value={0}/>
          {
            Object.keys(filterableFields)
                .map(f => {return {key: f, field: filterableFields[f]}})
                .sort((a, b) => (a.field.sortPosition - b.field.sortPosition))
                .map((f) => <option key={"field_type_"+f.key} value={f.key}>{f.field.labelAr + " " + f.field.labelHe}</option>)
          }
        </select>
      </div>
    </div>
  }.bind(this);

  getFieldOperators = function(){
    const condition = this.state.condition;
    const fieldType = condition.fieldType;
    const filterableFields = this.props.filterableFields;
    const field = filterableFields[fieldType];
    const options = field.options;
    if(Object.keys(options).length > 1){
      return <select value={condition.option} onChange={(e)=>{this.setConditionOption(e.target.value)}} className="condition-option-selection">
        {
          Object.keys(options)
              .map(o => {return {key: o, option: field.options[o]}})
              .sort((a, b) => (a.option.sortPosition - b.option.sortPosition))
              .map((f) => <option key={"field_option_"+f.key} value={f.key}>{f.option.labelAr + " " + f.option.labelHe}</option>)
        }
      </select>
    }
    else{
      return <div className={"fixed-field-option"}>
        <div>{field.options[condition.option].labelAr}</div>
        <div>{field.options[condition.option].labelHe}</div>
      </div>
    }
  };

  getFieldInput = function(){
    const condition = this.state.condition;
    if(!condition.option)
      return;
    const fieldType = condition.fieldType;
    const filterableFields = this.props.filterableFields;
    const fieldsFilterOptions = this.props.fieldsFilterOptions;
    const field = filterableFields[fieldType];
    const fieldOption = field.options[condition.option];
    const valueOptions = fieldOption.options ? fieldsFilterOptions[fieldOption.options] : [];
    switch(fieldOption.inputType){
      case "select":
        return <div>
          <select value={condition.value} onChange={(e)=>{this.setConditionValue(e.target.value)}} className="condition-input">
            <option value={0}/>
            {valueOptions.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>;
      case "citySelector":
        let selectionPreview = condition.value ? condition.value.slice(0, 20).join(", ") : "";
        if(selectionPreview.length > 75)
        {
          selectionPreview = selectionPreview.substring(0, 75) + "..."
        }
        return <div onClick={e => {e.stopPropagation();}}>
          <div onClick={()=>{this.setState({displayCitySelectorPopup: true})}} className="condition-input condition-selected-cities">
            {(condition.value && condition.value.length) ? selectionPreview : "בחירת ערים"}
          </div>
          <Popup
              visibility={this.state.displayCitySelectorPopup}
              toggleVisibility={()=>{this.setState({displayCitySelectorPopup: !this.state.displayCitySelectorPopup})}}
              height={"75vh"}
          >
            <CitySelector
                cities={valueOptions}
                selected={condition.value}
                onSelect={this.setConditionValue}
                width={1000}
                height={1000}
                top={33.344888}
                bottom={29.463942}
                left={34.2170233}
                right={35.949}
            />
          </Popup>
        </div>;
      case "eventSelector":
        return <div onClick={e => {e.stopPropagation();}}>
          <div onClick={()=>{this.setState({displayEventSelectorPopup: true})}} className="condition-input condition-selected-cities">
            {condition.value ? condition.value.name : "בחירת אירוע"}
          </div>
          <Popup
              visibility={this.state.displayEventSelectorPopup}
              toggleVisibility={()=>{this.setState({displayEventSelectorPopup: !this.state.displayEventSelectorPopup})}}
              height={"75vh"}
          >
            <EventPicker handleSelection={(id, event)=>{this.setConditionValue(event); this.setState({displayEventSelectorPopup: false});}} selected={condition.value ? condition.value._id : null}/>
          </Popup>
        </div>;
      case "text":
      default:
        return <div>
          <input type={"text"} value={condition.value}
                 onChange={(e)=>{this.setConditionValue(e.target.value, false)}}
                 onKeyDown={(e)=>{if(e.key === 'Enter'){this.updateCondition();}}}
                 className="condition-input condition-text-filter"/>
          <button type="button" className="condition-text-filter-button" onClick={this.updateCondition}>
            <FontAwesomeIcon icon="filter"/>
          </button>
        </div>;
    }
  };

  getFieldEditor = function(){
    return <div>
      <div className="heading">
        <div className="condition-title-wrap">
            <div className="condition-icon">
              {this.props.filterableFields[this.state.condition.fieldType].icon}
            </div>
            <div className="condition-title">
              <div>{this.props.filterableFields[this.state.condition.fieldType].labelAr}</div>
              <div>{this.props.filterableFields[this.state.condition.fieldType].labelHe}</div>
            </div>
        </div>
        <div className="remove-condition" onClick={this.props.removeCondition}>
          <FontAwesomeIcon icon="times"/>
        </div>
      </div>
      <div className="condition-container">
          {this.getFieldOperators()}
          {this.getFieldInput()}
      </div>
    </div>
  }.bind(this);

  render() {
    const condition = this.state.condition;
    const fieldType = condition.fieldType;
    return(
      <section
          className="single-condition"
      >
        {(fieldType !== null && fieldType !== undefined) ? this.getFieldEditor() : this.getFieldSelector()}
      </section>
    )
  }
}

export default SingleCondition;
