import React from 'react'
import server from '../services/server'
import Meta from '../lib/meta'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';
import htmlParser from 'html-to-react';
const HtmlToReactParser = htmlParser.Parser;

export default class DailySummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            summary: ""
        }
    }
    componentDidMount() {
        this.getDailySummary();
    }
    getDailySummary() {
        server.get('dailySummary', {})
            .then(summary => {
                this.setState({"summary": summary});
            });
    }
    render() {
        const summary = this.state.summary ? this.state.summary : "לא התבצעה פעילות היום";
        const htmlToReactParser = new HtmlToReactParser();
        return (
            <div>
                <Meta/>
                <style>{/**
                    .summary-wrap{
                        text-align: right;
                        padding: 3em;
                        font-size: 1.2em;
                    }**/}</style>
                <TopNavBar>
                    <div className="title-wrap">
                        <span className="title-lang">סיכום יומי</span>
                        <span className="title-lang">סיכום יומי</span>
                    </div>
                </TopNavBar>
                <div className={"summary-wrap"}>
                    {htmlToReactParser.parse(summary)}
                </div>
            </div>
        )
    }

}

