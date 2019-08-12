import React from 'react';
import './App.css';
import meta from './lib/meta';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NoMatch from "./pages/404";
import Login from "./pages/Login";
import Organizer from "./pages/Organizer";
import Activist from "./pages/Activist";
import EventManagement from "./pages/EventManagement";
import EventCreation from "./pages/EventCreation";
import CityManagement from "./pages/CityManagement";
import CircleManagement from "./pages/CircleManagement";
import EventCategoriesManagement from "./pages/EventCategoriesManagement";
import Typer from "./pages/Typer";
import ScanContacts from "./pages/ScanContacts";
import ImportContacts from "./pages/ImportContacts";
import DailySummary from "./pages/DailySummary";
import Settings from "./pages/Settings";
import MemberRegistration from "./pages/MemberRegistration";
import Voting from "./pages/Voting";
import VotingResults from "./pages/VotingResults";
import Welcome from "./pages/Welcome";

function App() {
  return (
      <Router>
        <div>
          <meta/>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/Login" exact component={Login} />
            <Route path="/Organizer" component={Organizer} />
            <Route path="/Activist" component={Activist} />
            <Route path="/EventManagement" component={EventManagement} />
            <Route path="/EventCreation" component={EventCreation} />
            <Route path="/CityManagement" component={CityManagement} />
            <Route path="/CircleManagement" component={CircleManagement} />
            <Route path="/EventCategoriesManagement" component={EventCategoriesManagement} />
            <Route path="/Typer" component={Typer} />
            <Route path="/ScanContacts" component={ScanContacts} />
            <Route path="/ImportContacts" component={ImportContacts} />
            <Route path="/DailySummary" component={DailySummary} />
            <Route path="/Settings" component={Settings} />
            <Route path="/MemberRegistration" exact component={MemberRegistration} />
            <Route path="/Voting" exact component={Voting} />
            <Route path="/VotingResults" exact component={VotingResults} />
            <Route path="/Welcome" exact component={Welcome} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
  );
}

export default App;
