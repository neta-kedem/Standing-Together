import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './CallPostponer.scss'
library.add(faCheckCircle);

export default class CallPostponer extends React.Component {
    validation = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    constructor(props) {
        super(props);
        this.state = {
            value: props['value']||"",
            handlePost: props['handlePost'],
            valid: false
        };
    }
    static getDerivedStateFromProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        return {value: (nextProps.value||"")};
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.checkValidity();
    }

    checkValidity(){
        this.setState({valid: this.validation.test(this.state.value)})
    };
    handleInputChange(event){
        this.setState({value: event.target.value}, ()=>{
            this.checkValidity();
        });
    };
    handlePost(){
        if(!this.state.valid)
            return;
        const val = this.state.value;
        this.state.handlePost(val);
    }
    handleKeyPress(event){
        if(event.key === 'Enter'){
            this.handlePost();
        }
    };
    render() {
        const val = this.state.value;
        const postButton =
            <div className={"postpone-button "+(this.state.valid?"":"hide")} onClick={this.handlePost.bind(this)}>
                <FontAwesomeIcon icon="check-circle" className="label-icon"/>
            </div>;
        return (
            <div>
                <input className="postpone-input" type="text" value={val} onKeyPress={this.handleKeyPress.bind(this)} onChange={(event)=>{this.handleInputChange(event)}}/>
                {postButton}
            </div>
        )
    }
}
