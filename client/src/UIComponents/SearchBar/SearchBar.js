import React from 'react';
import "./SearchBar.scss";
import { library } from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faSearch} from '@fortawesome/free-solid-svg-icons';
library.add(faSearch);

export default class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onSearch: props.onSearch,
            search: props.initVal,
            placeholder: props.placeholder
        };
    }
    syncStateToInput=function(event){
        this.setState({search: event.target.value});
    }.bind(this);
    handlePost=function(){
        this.state.onSearch(this.state.search);
    }.bind(this);
    handleKeyPress = function(event){
        if(event.key === 'Enter'){
            this.handlePost();
        }
    }.bind(this);
    render() {
        return <div className="search-bar-wrap">
                    <input
                        className={"search-input"}
                        onChange={(event)=>this.syncStateToInput(event)}
                        onKeyPress={this.handleKeyPress}
                        placeholder={this.state.placeholder}/>
                    <div onClick={this.handlePost.bind(this)} className='search-button'>
                        <FontAwesomeIcon className='search-button-icon' icon="search"/>
                    </div>
                </div>
    }
}
