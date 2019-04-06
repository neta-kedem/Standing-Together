import React from 'react'
import server from '../services/server'
import Meta from '../lib/meta'
import CircleDetails from './circleManagement/CircleDetails'
import style from './circleManagement/CircleManagement.css'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';

export default class CircleManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circles: [],
            mailchimpLists: []
        }
    }
    componentDidMount() {
        this.getCircles();
        this.getMailchimpLists();
    }
    getCircles() {
        server.get('circles', {})
            .then(circles => {
                this.setState({"circles": circles});
            });
    }
    getMailchimpLists() {
        server.get('mailchimp/lists/', {})
            .then(mailchimpLists => {
                this.setState({"mailchimpLists": mailchimpLists.lists});
            });
    }
    setCircleName(name, index) {
        let circles = this.state.circles.slice();
        circles[index].name = name;
        circles[index].changed = true;
        this.setState({circles: circles})
    }
    setCircleMailchimpList(mailchimpList, index) {
        let circles = this.state.circles.slice();
        circles[index].mailchimpList = mailchimpList;
        circles[index].changed = true;
        this.setState({circles: circles})
    }
    createCircle() {
        let circles = this.state.circles.slice();
        circles.push({changed: true, name:"", mailchimpList:""});
        this.setState({circles: circles})
    }
    saveCircles() {
        let changedCircles = this.state.circles.slice().filter((circle)=>{return circle.changed});
        server.post('circles', {circles: changedCircles});
        alert("saved!");
        this.getCircles();
    }

    render() {
        const circles = this.state.circles.slice();
        const lists = this.state.mailchimpLists.slice();
        const rows = circles.map((circle,i)=>{
            return <CircleDetails
                values={circle}
                key={"circle_"+circle._id+"_"+i}
                setName={this.setCircleName.bind(this)}
                setMailchimpList={this.setCircleMailchimpList.bind(this)}
                mailchimpLists={lists}
                rowIndex={i}
            />;
        });
        return (
            <div>
                <Meta/>
                <style jsx global>{style}</style>
                <TopNavBar>
                    <div className="title-wrap">
                        <span className="title-lang">ניהול מעגלים</span>
                        <span className="title-lang">ניהול מעגלים</span>
                    </div>
                </TopNavBar>
                <table className={"circle-table"}>
                    <thead>
                        <tr>
                            <th>
                                <div>שם מעגל</div>
                                <div>שם מעגל</div>
                            </th>
                            <th>
                                <div>רשימת קשר</div>
                                <div>רשימת קשר</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <button type="button" className="add-circle-button" onClick={this.createCircle.bind(this)}>הוספת מעגל</button>
                <button type="button" className="save-circles-button" onClick={this.saveCircles.bind(this)}>שמירה</button>
            </div>
        )
    }

}

