import React from 'react'
import server from '../services/server'
import Meta from '../lib/meta'
import CityDetails from './cityManagement/CityDetails'
import style from './cityManagement/CityManagement.css'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';

export default class CircleManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            circles: []
        }
    }
    componentDidMount() {
        this.getCities();
        this.getCircles();
    }
    getCities() {
        server.get('cities', {})
            .then(cities => {
                this.setState({"cities": cities});
            });
    }
    getCircles() {
        server.get('circles', {})
            .then(circles => {
                this.setState({"circles": circles});
            });
    }
    setDefaultCircle(circle, index) {
        let cities = this.state.cities.slice();
        cities[index].defaultCircle = circle;
        cities[index].changed = true;
        this.setState({cities: cities})
    }
    setName(name, index) {
        let cities = this.state.cities.slice();
        cities[index].name = name;
        cities[index].changed = true;
        this.setState({cities: cities})
    }
    createCircle() {
        let cities = this.state.cities.slice();
        cities.push({changed: true, name:"", mailchimpList:""});
        this.setState({cities: cities})
    }

    render() {
        const cities = this.state.cities.slice();
        const circles = this.state.circles.slice();
        const rows = cities.map((city,i)=>{
            return <CityDetails
                values={city}
                key={"circle_"+city._id+"_"+i}
                setName={this.setName.bind(this)}
                setDefaultCircle={this.setDefaultCircle.bind(this)}
                circles={circles}
                rowIndex={i}
            />;
        });
        return (
            <div>
                <Meta/>
                <style jsx global>{style}</style>
                <TopNavBar>
                    <div className="title-wrap">
                        <span className="title-lang">ניהול ערים</span>
                        <span className="title-lang">ניהול ערים</span>
                    </div>
                </TopNavBar>
                <table className={"circle-table"}>
                    <thead>
                        <tr>
                            <th>
                                <div>שם עיר</div>
                                <div>שם עייר</div>
                            </th>
                            <th>
                                <div>שיוך אוטומטי למעגל</div>
                                <div>שיוך אוטומטי למעגל</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <button type="button" className="add-circle-button" onClick={this.createCircle.bind(this)}>הוספת עיר</button>
                <button type="button" className="save-cities-button" onClick={this.createCircle.bind(this)}>שמירה</button>
            </div>
        )
    }

}

