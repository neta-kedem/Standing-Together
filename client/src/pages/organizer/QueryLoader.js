import React from 'react';
import server from '../../services/server';
import Popup from "../../UIComponents/Popup/Popup";
import "./QueryLoader.scss";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import LoadSpinner from "../../UIComponents/LoadSpinner/LoadSpinner";
library.add(faSave, faFolderOpen);

export default class QueryLoader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setFilters: this.props.setFilters,
            savedQueries: [],
            loadingQueries: false,
            displayLoadQueryPopup: false,
            displaySaveQueryPopup: false,
            saveName: "",
            saveId: null
        };
    }

    componentDidMount() {
        this.getSavedQueries();
    }

    getSavedQueries() {
        this.setState({loadingQueries: true});
        server.get('queries').then(queries => {
           this.setState({savedQueries: queries, loadingQueries: false});
        });
    }

    loadSavedQuery = function(queryId) {
        server.get('queries/'+queryId).then(query => {
            this.state.setFilters(JSON.parse(query.filters));
            this.setState({
                displayLoadQueryPopup: false,
                saveName: "",
                saveId: null
            });
        });
    }.bind(this);

    saveQuery = function(){
        const query = {
            filters: JSON.stringify(this.props.currFilters),
            name: this.state.saveName,
            _id: this.state.saveId
        };
        server.post('queries', {'query': query})
            .then(json => {
                if(json)
                    alert("Saved");
                this.setState({
                    displaySaveQueryPopup: false,
                    saveName: "",
                    saveId: null
                });
                this.getSavedQueries();
            });
    }.bind(this);

    toggleLoadPopup = function(){
        this.setState({
            displayLoadQueryPopup: !this.state.displayLoadQueryPopup,
            saveName: "",
            saveId: null
        });
    }.bind(this);

    toggleSavePopup = function(){
        this.setState({
            displaySaveQueryPopup: !this.state.displaySaveQueryPopup,
            saveName: "",
            saveId: null
        });
    }.bind(this);

    setSaveName = function(name){
        this.setState({saveName: name, saveId: null}, ()=>{
            for(let i = 0; i < this.state.savedQueries.length; i++){
                if(this.state.savedQueries[i].name === name)
                    this.overrideQuery(this.state.savedQueries[i]);
            }
        });
    }.bind(this);

    overrideQuery = function(query){
        this.setState({saveName: query.name, saveId: query._id})
    }.bind(this);

    render() {
        const queries = this.state.savedQueries.slice();
        return(
            <div className="query-loader-wrapper">
                <div className="query-loader-controls-wrap">
                    <button type={"button"} className="query-loader-control load-query" onClick={this.toggleLoadPopup}>
                        <FontAwesomeIcon icon={"folder-open"}/>
                    </button>
                    <button type={"button"} className="query-loader-control save-query" onClick={this.toggleSavePopup}>
                        <FontAwesomeIcon icon={"save"}/>
                    </button>
                </div>
                <Popup visibility={this.state.displayLoadQueryPopup} toggleVisibility={this.toggleLoadPopup}>
                    <h3>تحميل البيانات</h3>
                    <h3>טעינת שאילתה</h3>
                    {
                        queries.map((q, i) => {
                            return <div key={i} className={"saved-query"} onClick={()=>{this.loadSavedQuery(q._id)}}>{q.name}</div>
                        })
                    }
                    <LoadSpinner visibility={this.state.loadingQueries} align={"center"}/>
                </Popup>
                <Popup visibility={this.state.displaySaveQueryPopup} toggleVisibility={this.toggleSavePopup}>
                    <h3>حفظ البيانات</h3>
                    <h3>שמירת שאילתה</h3>
                    {
                        queries.map((q, i) => {
                            return <div key={i} className={"saved-query"} onClick={()=>{this.overrideQuery(q)}}>{q.name}</div>
                        })
                    }
                    <LoadSpinner visibility={this.state.loadingQueries} align={"center"}/>
                    <div className={"save-query-wrap"}>
                        <input value={this.state.saveName} className={"save-query-name-input"} onChange={(e)=>{this.setSaveName(e.target.value)}}/>
                        <button type={"button"} className={"save-query-button"} onClick={this.saveQuery}>save</button>
                    </div>
                </Popup>
            </div>
        )
    }
}