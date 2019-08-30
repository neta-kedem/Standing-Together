import React from 'react';
import './LoadSpinner.scss';

export default class LoadSpinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibility: true
        };
    }
    render() {
        return this.props.visibility ? (
            <div className={"spinner-wrap " + (this.props.align === "center" ? "centered" : "")}>
                <div className="load-spinner">
                    {this.props.children}
                </div>
            </div>
        ):<div/>
    }
}
