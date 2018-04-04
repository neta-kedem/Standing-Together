import React from 'react';
import TopNavBar from './organizer/TopNavbar'
import ItemService from '../services/ItemService'
import QueryCreator from './organizer/QueryCreator'

const wrapper = {
  display: "flex",
  justifyContent: "space-between"
};
const leftPanel = {
  position: "relative",
  overflow: "visible",
  width: 290,
  height: "95.5vh",
  minHeight: 500,
  padding: 20,
  float: "left",
  backgroundColor: "#fbfbfb",
  textAlign: "center"
};

export default class Organizer extends React.Component {

  state = {activists: [], currFilters: []};

  componentDidMount() {
    ItemService.getAcivists()
        .then(activists =>
            this.setState({activists}));
    ItemService.getCurrFilters()
        .then(currFilters =>
            this.setState({currFilters}));
  }

  render() {
    const itemChilds = this.state.activists.map(activist =>
        <li key={activist._id}>
          <span>{activist.name}</span>
        </li>);

    return (
        <div>
          <TopNavBar></TopNavBar>
          <div style={wrapper}>
            {/*<TopNavBar></TopNavBar>*/}
            <div className={"leftPanel"} style={leftPanel}>
              <QueryCreator currFilters={this.state.currFilters}></QueryCreator>
            </div>
            <div>
              <ul>
                {itemChilds}
              </ul>
            </div>
          </div>
        </div>
    )
  }

}

