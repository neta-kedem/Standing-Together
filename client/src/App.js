import React from 'react';
import './App.css';
import meta from './lib/meta';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/Login";
import Organizer from "./pages/Organizer";
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

function App() {
  return (
      <Router>
        <div>
          <meta/>
          <Route path="/" exact component={Login} />
          <Route path="/Login" exact component={Login} />
          <Route path="/Organizer" component={Organizer} />
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
        </div>
      </Router>
  );
}

export default App;
