import React from "react";
import Meta from "../../lib/meta";
import AddFiltersBtn from "./AddFiltersBtn";
import server from "../../services/server";
import QueryService from "../../services/queryService";

import fontawesome from "@fortawesome/fontawesome";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/fontawesome-free-solid";
fontawesome.library.add(faCaretDown);

class CreateFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: props.index,
      returnFilter: props.newFilter,
      // filter:props.filter,
      // show: props.isShow,
      newFilter: {},
      availableFilters: [],
      cities: [],
      circles: []
    };
  }

  componentDidMount() {
    this.getCities();
    this.getCircles();
    this.getAvailableFilters();
    this._getQueryFilter.bind(this);
  }

  getCities() {
    server.get("cities", {}).then(cities => {
      this.setState({ cities: cities });
    });
  }

  getAvailableFilters() {
    // this.setState({"availableFilters": QueryService.getAvailableFilters()});
    QueryService.getAvailableFilters().then(availableFilters => {
      this.setState({ availableFilters: availableFilters });
    });
  }

  getCircles() {
    server.get("circles", {}).then(circles => {
      this.setState({ circles: circles });
    });
  }

  getPossibleQueries() {
    return this.state.availableFilters.map(filter => filter.label);
  }

  componentWillReceiveProps(props) {
    this.setState({ newFilter: {} });
  }

  _getQueryFilter() {
    const filterLabel = this.state.newFilter.filterName;
    if (!filterLabel) return null;

    let filter = this.state.availableFilters.find(
      filter => filter.label === filterLabel
    );

    if (!filter) return null;

    if (!filter.options) {
      return (
        <input
          style={{
            marginLeft: 10,
            border: "5px solid white",
            fontSize: "1em",
            backgroundColor: "white",
            outline: "none"
          }}
          type="text"
          onChange={ev => {
            let newFilter = this.state.newFilter
            newFilter.filterMain = ev.target.value;
            this.setState({ newFilter })
            }
          }
        />
      );
    }
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start"
        }}
      >
        <select
          style={{
            marginLeft: 10,
            border: "5px solid white",
            fontSize: "1em",
            backgroundColor: "white",
            outline: "none",
            marginBottom: "5px"
          }}
          name="options"
          defaultValue={""}
          onClick={ev => ev.stopPropagation()}
          onChange={ev => {
            let newFilter = this.state.newFilter
            newFilter.filterPrefix = ev.target.value;
            this.setState({ newFilter });
          }}
        >
          <option value={""} disabled hidden>
            {""}
          </option>
          {filter.options.map((option, i) => (
            <option value={option} key={i}>
              {option}
            </option>
          ))}
        </select>
        <input
          type="text"
          style={{
            marginLeft: 10,
            border: "5px solid white",
            fontSize: "1em",
            backgroundColor: "white",
            outline: "none"
          }}
          onChange={ev => {
            let newFilter = this.state.newFilter
            newFilter.filterMain = ev.target.value;
            this.setState({ newFilter });
          }}
        />
      </div>
    );
  }

  saveFilter(ev) {
    this.state.returnFilter(this.state.newFilter);
    ev.preventDefault();
    ev.stopPropagation();
  }

  render() {
    return (
      <section
        style={{
          background: "#F5E9EC",
          padding: "10px",
          borderRadius: "5",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start"
        }}
        className={this.props.show ? "" : "hidden"}
        onClick={ev => ev.stopPropagation()}
      >
        {/*<AddFiltersBtn text="Add Filter" type="single" saveFilter={this.saveFilter.bind(this)}/>*/}
        <select
          style={{
            marginLeft: 10,
            border: "5px solid white",
            fontSize: "1em",
            backgroundColor: "white",
            outline: "none",
            marginBottom: "5px"
          }}
          name="queries"
          defaultValue=""
          value={this.state.newFilter.filterName}
          onClick={ev => ev.stopPropagation()}
          onChange={ev =>
            this.setState({ newFilter: { filterName: ev.target.value } })
          }
        >
          <option value={""} disabled hidden>
            {""}
          </option>
          {this.getPossibleQueries().map((option, i) => (
            <option value={option} key={i}>
              {option}
            </option>
          ))}
        </select>
        {this._getQueryFilter()}
        <Meta />
        <style global jsx>
          {`
            .hidden {
              display: none;
            }
          `}
        </style>
        <div
          style={{
            border: "2px solid #90278e",
            borderRadius: "5px",
            padding: 5,
            backgroundColor: "white"
          }}
          onClick={() => {
            this.props.saveFilter(this.state.newFilter)
            this.setState({ newFilter: {} })
          }}
        >
          Save Filter
        </div>
      </section>
    );
  }
}

export default CreateFilter;
