import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faChevronCircleLeft);

export default class PrevCalls extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const lastCallAt = this.props.lastCallAt;
        const callCount = this.props.callCount;
        const banner = <div className="prev-calls-banner">
            <span>שימו לב! התקשרנו לפעיל/ה האלו כבר</span>
            {callCount>1?<span>{" "+callCount+" פעמים"}</span>:""}
            <span>, בפעם האחרונה ב-</span>
            {lastCallAt?<span>{lastCallAt.getHours()+":"+lastCallAt.getMinutes()}</span>:""}
        </div>;
        return (
            <div>
                <style jsx global>
                    {`
					.prev-calls-banner-wrap{
					    position: relative;
					}
					.prev-calls-banner{
                        position: absolute;
                        width: 100%;
                        padding: 1em;
                        text-align: center;
                        font-weight: bold;
                        color: white;
                        background: rgb(255, 56, 131);
                        z-index: 500;
					}
				    `}
                </style>
                <div className="prev-calls-banner-wrap">
                    {callCount?banner:""}
                </div>
            </div>
        )
    }
}
