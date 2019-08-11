import React from 'react';

export default class LoadSpinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibility: true
        };
    }
    render() {
        return this.props.visibility ? (
            <div className="spinner-wrap">
                {/*credit to luke hass, https://projects.lukehaas.me/css-loaders/*/}
                <style jsx global>
                    {`
                    .load-spinner {
                      font-size: 10px;
                      text-indent: -9999em;
                      width: 5em;
                      height: 5em;
                      border-radius: 50%;
                      background: #ffffff;
                      background: -moz-linear-gradient(left, #90278e 10%, rgba(255, 255, 255, 0) 42%);
                      background: -webkit-linear-gradient(left, #90278e 10%, rgba(255, 255, 255, 0) 42%);
                      background: -o-linear-gradient(left, #90278e 10%, rgba(255, 255, 255, 0) 42%);
                      background: -ms-linear-gradient(left, #90278e 10%, rgba(255, 255, 255, 0) 42%);
                      background: linear-gradient(to right, #90278e 10%, rgba(255, 255, 255, 0) 42%);
                      position: relative;
                      -webkit-animation: load 1.4s infinite linear;
                      animation: load 1.4s infinite linear;
                      -webkit-transform: translateZ(0);
                      -ms-transform: translateZ(0);
                      transform: translateZ(0);
                    }
                    .load-spinner:before {
                      width: 50%;
                      height: 50%;
                      background: #90278e;
                      border-radius: 100% 0 0 0;
                      position: absolute;
                      top: 0;
                      left: 0;
                      content: '';
                    }
                    .load-spinner:after {
                      background: #fff;
                      width: 75%;
                      height: 75%;
                      border-radius: 50%;
                      content: '';
                      margin: auto;
                      position: absolute;
                      top: 0;
                      left: 0;
                      bottom: 0;
                      right: 0;
                    }
                    @-webkit-keyframes load {
                      0% {
                        -webkit-transform: rotate(0deg);
                        transform: rotate(0deg);
                      }
                      100% {
                        -webkit-transform: rotate(360deg);
                        transform: rotate(360deg);
                      }
                    }
                    @keyframes load {
                      0% {
                        -webkit-transform: rotate(0deg);
                        transform: rotate(0deg);
                      }
                      100% {
                        -webkit-transform: rotate(360deg);
                        transform: rotate(360deg);
                      }
                    }
				    `}
                </style>
                <div className="load-spinner">
                    {this.props.children}
                </div>
            </div>
        ):<div/>
    }
}
