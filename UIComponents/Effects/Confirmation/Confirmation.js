import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faCheckCircle);

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
    componentWillReceiveProps(nextProps, nextState) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if(!nextProps.visible)
            return;
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
                <style jsx global>
                {`
                    @-webkit-keyframes slide-fwd-top {
                      0% {
                        -webkit-transform: translateY(0) scale(0);
                                transform: translateY(0) scale(0);
                      }
                      50% {
                        -webkit-transform: translateY(-20vw) scale(1);
                                transform: translateY(-20vw) scale(1);
                      }
                      100% {
                        -webkit-transform: translateY(-100vw) scale(0);
                                transform: translateY(-100vw) scale(0);
                      }
                    }
                    @keyframes slide-fwd-top {
                      0% {
                        -webkit-transform: translateY(0) scale(0);
                                transform: translateY(0) scale(0);
                      }
                      50% {
                        -webkit-transform: translateY(-20vw) scale(1);
                                transform: translateY(-20vw) scale(1);
                      }
                      100% {
                        -webkit-transform: translateY(-60vw) scale(0);
                                transform: translateY(-60vw) scale(0);
                      }
                    }
					.confirmation-icon{
						position: fixed;
						font-size: 20vw;
						line-height: 20vw;
						left: 40vw;
						top: 30vw;
						color: #90278e;
						background-color: rgb(255, 206, 241);
						border-radius: 20vw;
						box-shadow: 0px 10px 30px 0px #00000088;
						-webkit-animation: slide-fwd-top 1.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards;
						animation: slide-fwd-top 1.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards;
				`}
                </style>
                {this.state.visible?<div className="confirmation-icon">
                    <FontAwesomeIcon icon="check-circle"/>
                </div>:""}
            </div>
    }
}
