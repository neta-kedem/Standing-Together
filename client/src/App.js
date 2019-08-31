import React from 'react';
import meta from './lib/meta';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PubSub from 'pubsub-js';
import events from './lib/events';
import Alert from './UIComponents/Alert/Alert'

import NoMatch from "./pages/404";
import Login from "./pages/Login";
import LockMe from "./pages/LockMe";
import Organizer from "./pages/Organizer";
import Activist from "./pages/Activist";
import EventManagement from "./pages/EventManagement";
import EventCreation from "./pages/EventCreation";
import CityManagement from "./pages/CityManagement";
import CircleManagement from "./pages/CircleManagement";
import EventCategoriesManagement from "./pages/EventCategoriesManagement";
import WhatsappMessenger from "./pages/WhatsappMessenger";
import Typer from "./pages/Typer";
import ScanContacts from "./pages/ScanContacts";
import ImportContacts from "./pages/ImportContacts";
import DailySummary from "./pages/DailySummary";
import Settings from "./pages/Settings";
import MemberRegistration from "./pages/MemberRegistration";
import Voting from "./pages/Voting";
import VotingResults from "./pages/VotingResults";
import Welcome from "./pages/Welcome";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alertQueue: []
    };
    PubSub.subscribe(events.alert, function (msg, data) {
      this.alert(data)
    }.bind(this));
    PubSub.subscribe(events.clearAlert, function (msg, data) {
      this.clearAlert(data)
    }.bind(this));
  }

  componentWillUnmount() {
    PubSub.clearAllSubscriptions();
  }

  alert(alert) {
    let alertQueue = this.state.alertQueue.slice();
    if(alert.flush){
      alertQueue = [alert];
    }
    else{
      alertQueue.push(alert);
    }
    this.setState({alertQueue});
  }

  clearAlert(options) {
    let alertQueue = this.state.alertQueue.slice();
    if(options.clearAll){
      alertQueue = [];
    }
    else{
      alertQueue.splice(0, 1);
    }
    this.setState({alertQueue});
  }

  render() {
    return (
        <Router>
          <div>
            <meta/>
            <Switch>
              <Route path="/" exact component={Login}/>
              <Route path="/Login" exact component={Login}/>
              <Route path="/LockMe" exact component={LockMe}/>
              <Route path="/Organizer" component={Organizer}/>
              <Route path="/Activist" component={Activist}/>
              <Route path="/EventManagement" component={EventManagement}/>
              <Route path="/EventCreation" component={EventCreation}/>
              <Route path="/CityManagement" component={CityManagement}/>
              <Route path="/CircleManagement" component={CircleManagement}/>
              <Route path="/EventCategoriesManagement" component={EventCategoriesManagement}/>
              <Route path="/Typer" component={Typer}/>
              <Route path="/ScanContacts" component={ScanContacts}/>
              <Route path="/ImportContacts" component={ImportContacts}/>
              <Route path="/DailySummary" component={DailySummary}/>
              <Route path="/Settings" component={Settings}/>
              <Route path="/MemberRegistration" exact component={MemberRegistration}/>
              <Route path="/Voting" exact component={Voting}/>
              <Route path="/VotingResults" exact component={VotingResults}/>
              <Route path="/Welcome" exact component={Welcome}/>
              <Route path="/WhatsappMessenger" exact component={WhatsappMessenger}/>
              <Route component={NoMatch}/>
            </Switch>
            <Alert setQueue={(alertQueue)=>this.setState({alertQueue})} queue={this.state.alertQueue}/>
          </div>
        </Router>
    );
  }
}