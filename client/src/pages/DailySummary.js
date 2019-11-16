import React from 'react'
import server from '../services/server'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';
import htmlParser from 'html-to-react';
import "./dailySummary/DailySummary.scss"
const HtmlToReactParser = htmlParser.Parser;

export default class DailySummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            summary: "",
            loading: true
        }
    }
    componentDidMount() {
        this.getDailySummary();
    }
    getDailySummary() {
        server.get('dailySummary', {})
            .then(summary => {
                this.setState({"summary": summary, loading: false});
            });
    }
    render() {
        const summary = this.state.summary ? this.state.summary : (this.state.loading ? "loading..." : "לא התבצעה פעילות היום");
        const htmlToReactParser = new HtmlToReactParser();
        return (
            <div className={"page-wrap-daily-summary"}>
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

