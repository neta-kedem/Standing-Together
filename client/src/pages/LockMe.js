import React from 'react'
import server from '../services/server'
import "./lockMe/LockMe.scss"
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faLock} from '@fortawesome/free-solid-svg-icons'
import QueryString from "query-string";
library.add(faLock);

export default class LockMe extends React.Component {

    componentDidMount() {
        const lockToken = QueryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).lockToken;
        server.post('lock/email', {'lockToken': lockToken})
            .then(() => {});
    }

    render() {
        return (
            <div className={"page-wrap-lock-me"}>
                <div className={"lock-logo"}>
                    <FontAwesomeIcon icon={"lock"}/>
                </div>
                <p>הגישה למערכת באמצעות המשתמש שלך נחסמה, ונשלח מייל למנהלי המערכת</p>
                <p>הגישה למערכת באמצעות המשתמש שלך נחסמה, ונשלח מייל למנהלי המערכת</p>
            </div>
        )
    }
}