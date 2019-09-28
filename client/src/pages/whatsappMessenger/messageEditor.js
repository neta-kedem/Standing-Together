import React from 'react'
import './messageEditor.scss'

export default class MessageEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handleChange: this.props.onChange,
            addVersion: this.props.addVersion,
            selectVersion: this.props.selectVersion,
            editing: false
        }
    }

    addVersion = () => {
        this.state.addVersion();
    };

    handleChange = (value) => {
        const qwerty = {
            "/":"Q", "'":"W", "ק":"E", "ר":"R", "א":"T", "ט":"Y", "ו":"U", "ן":"I", "ם":"O", "פ":"P", "]":"[",
            "[":"]", "ש":"A", "ד":"S", "ג":"D", "כ":"F", "ע":"G", "י":"H", "ח":"J", "ל":"K", "ך":"L", "ף":";",
            "ז":"Z", "ס":"X", "ב":"C", "ה":"V", "נ":"B", "מ":"N", "צ":"M", "ת":",", "ץ":".",
        };
        let message = value;
        const paramLike = Array.from(message.matchAll(/\$[^.,:;"'\s]*/g));
        for(let i = 0; i < paramLike.length; i++){
            let match = paramLike[i][0];
            let toUpper = match.split("").map(char => {return qwerty[char] ? qwerty[char] : char}).join("").toUpperCase();
            message = message.replace(match, toUpper);
        }
        this.state.handleChange(message);
    };

    highlightParams = (message) => {
        const params = this.props.params.map(p => "$"+p);
        //an array of all the words that look like a param reference (i.e. start with a $)
        const paramLike = Array.from(message.matchAll(/\$[^.,:;"'\s]*/g));
        const result =[];
        let pos = 0;
        for(let i = 0; i < paramLike.length; i++){
            let match = paramLike[i];
            let isParam = params.indexOf(match[0]) !== -1;
            result.push(message.substring(pos, match.index));
            result.push(
                <span
                    key={"param_highlight_"+i}
                    className={"whatsapp-message-param " + (!isParam ? "invalid-param" : "")}
                    title={isParam ? null : "הפרמטר הזה לא מופיע בטבלה"}
                >
                    {message.substring(match.index, match.index + match[0].length)}
                </span>
            );
            pos = match.index + match[0].length;
        }
        result.push(message.substring(pos, message.length));
        return result;
    };

    render() {
        const messages = this.props.messages;
        const selected = messages[this.props.selectedVersion].content;
        return (
            <div className={"whatsapp-message-wrap"}>
                <div className={"whatsapp-message-label"}>
                תוכן ההודעה:
                </div>
                <div className={"message-input-wrap"}>
                    {
                    this.state.editing ?
                        <textarea
                            value={selected}
                            onChange={(e) => {this.handleChange(e.target.value)}}
                            onBlur={() => {this.setState({editing: false})}}
                            autoFocus={true}
                            className={"whatsapp-message"}
                        /> :
                        <div className={"whatsapp-message"} onClick={()=>{this.setState({editing: true})}}>
                            {this.highlightParams(selected)}
                        </div>
                    }
                    <div className="message-version-switch">
                        {
                            messages.map((m, i) => {
                                return <button
                                    key={"version_" + i}
                                    type={"button"}
                                    className={"message-version " + ((i === this.props.selectedVersion) ? "selected " : "")}
                                    onClick={()=>{this.state.selectVersion(i)}}
                                >{m.name}</button>
                            })
                        }
                        <button type={"button"} className={"add-version"} onClick={this.state.addVersion}>+</button>
                    </div>
                </div>
            </div>
        )
    }
}