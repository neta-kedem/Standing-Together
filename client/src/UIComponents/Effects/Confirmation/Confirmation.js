import React from 'react';
import "./Confirmation.scss";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
library.add(faCheckCircle);

export default class Confirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //this function should toggle the value controlling the animation triggering back to 'false'
            toggleVisibility: props.toggleVisibility,
            //a 'true' value should be supplied to the visible attribute for the animation to start
            visible: false
        };
    }
    static getDerivedStateFromProps(nextProps, nextState) {
        return {visible: nextProps.visible};
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.visible)
            this.triggerAnimation();
    }

    triggerAnimation(){
        this.setState({visible: true}, ()=>{
            setTimeout(()=>{
                this.setState({visible: false});
                this.state.toggleVisibility();
            }, 2000);
        });
    }
    render() {
        return <div>
                {this.state.visible?<div className="confirmation-icon">
                    <FontAwesomeIcon icon="check-circle"/>
                </div>:""}
            </div>
    }
}
