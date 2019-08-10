import React from 'react'
import server from '../services/server'
import Meta from '../../lib/meta'
import CityDetails from './cityManagement/CityDetails'
import style from './cityManagement/CityManagement.css'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';
import CitySelector from '../UIComponents/CitySelector/CitySelector';

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
    setHeName(name, index) {
        let cities = this.state.cities.slice();
        cities[index].nameHe = name;
        cities[index].changed = true;
        this.setState({cities: cities})
    }
    setArName(name, index) {
        let cities = this.state.cities.slice();
        cities[index].nameAr = name;
        cities[index].changed = true;
        this.setState({cities: cities})
    }
    createCity() {
        let cities = this.state.cities.slice();
        cities.push({changed: true, nameHe:"", nameAr:"", defaultCircle: null});
        this.setState({cities: cities})
    }
    saveCities() {
        let changedCities = this.state.cities.slice().filter((city)=>{return city.changed});
        server.post('cities', {cities: changedCities}).then(()=>{
            alert("saved!");
            this.getCities();
        })
    }

    render() {
        const cities = this.state.cities.slice();
        const circles = this.state.circles.slice();
        const rows = cities.map((city,i)=>{
            return <CityDetails
                values={city}
                key={"circle_"+city._id+"_"+i}
                setHeName={this.setHeName.bind(this)}
                setArName={this.setArName.bind(this)}
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
                        <span className="title-lang">ادارة بلدات</span>
                        <span className="title-lang">ניהול ערים</span>
                    </div>
                </TopNavBar>
                <table className={"city-table"}>
                    <thead>
                        <tr>
                            <th>
                                <div>اسم البلد - بالعبرية</div>
                                <div>שם עיר - עברית</div>
                            </th>
                            <th>
                                <div>اسم البلد - بالعربية</div>
                                <div>שם עיר - ערבית</div>
                            </th>
                            <th>
                                <div>انتماء تلقائي للدائرة</div>
                                <div>שיוך אוטומטי למעגל</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <button type="button" className="add-city-button" onClick={this.createCity.bind(this)}>اضافة بلد - הוספת עיר</button>
                <button type="button" className="save-cities-button" onClick={this.saveCities.bind(this)}>
                    حفظ
                    שמירה
                </button>
                <CitySelector
                    cities={this.state.cities}
                    width={1000}
                    height={1000}
                    top={33.344888}
                    bottom={29.463942}
                    left={34.2170233}
                    right={35.949}
                />
            </div>
        )
    }

}

