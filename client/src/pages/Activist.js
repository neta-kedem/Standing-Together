import React from 'react'
import server from '../services/server'
import './activist/activist.scss'
import {Link} from "react-router-dom";
import QueryString from 'query-string';
import FormSegment from './activist/formSegment'
import LoadSpinner from "../UIComponents/LoadSpinner/LoadSpinner";
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSave, faLock, faLockOpen} from '@fortawesome/free-solid-svg-icons'
library.add(faSave, faLock, faLockOpen);

export default class Activist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: QueryString.parse(props.location.search, { ignoreQueryPrefix: true }).id,
            activist: {},
            savingInProcess: false,
            loadingDetails: false,
            profileDataLists: {
                residency:{field:"residency", data:[]},
                circle:{field:"circle", data:[]},
                isNewsletter:{field:"isNewsletter", data:['subscribed', 'unsubscribed' , 'not subscribed', 'cleaned', 'pending']}
            },
            profileFields: [
                {
                    name: "firstName", type: "text", ar: "الاسم الشخصي", he: "שם פרטי",
                    validation: /^.{2,}$/,
                    required: true
                },
                {
                    name: "lastName", type: "text", ar: "اسم العائلة", he: "שם משפחה",
                    required: false
                },
                {
                    name: "phone", type: "tel", ar: "رقم الهاتف", he: "טלפון",
                    validation: /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,}$/
                },
                {
                    name: "residency", type: "text", ar: "البلد", he: "עיר",
                    validation: /^.{2,}$/,
                    required: true
                },
                {
                    name: "email", type: "email", ar: "البريد الإلكتروني", he: "אימייל",
                    validation: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                },
                {
                    name: "circle", type: "select", ar: "", he: "מעגל",
                },
                {
                    name: "isNewsletter", type: "select", ar: "", he: "חבר בתנועה",
                },
            ],
            roleFields: [
                {
                    name: "isTyper", type: "checkbox", he: "קלדנות",
                },
                {
                    name: "isCaller", type: "checkbox", he: "טלפנות",
                }
            ],
            memberFields: [
                {
                    name: "street", type: "text", he: "קלדנות",
                },
                {
                    name: "houseNum", type: "text", he: "טלפנות",
                },
                {
                    name: "apartmentNum", type: "text", he: "ארגון",
                },
                {
                    name: "mailbox", type: "text", he: "ארגון",
                },
                {
                    name: "TZ", type: "text", he: "ארגון",
                },
                {
                    name: "birthday", type: "text", he: "ארגון",
                },

            ],
            unsaved: false
        };
    }
    componentDidMount() {
        this.fetchCities();
        this.fetchCircles();
        if(this.state["_id"]){
            this.fetchActivist();
        }
        //confirm exit without saving
        window.onbeforeunload = this.refreshHandler;
    }
    refreshHandler = function() {
        if(this.state.unsaved)
            return "You Have Unsaved Data - Are You Sure You Want To Quit?";
    }.bind(this);

    fetchActivist(){
        this.setState({loadingDetails: true});
        server.get('activists/'+this.state._id)
            .then(activist => {
                if(!activist || activist.error)
                    return;
                this.setState({
                    activist: activist,
                    loadingDetails: false
                });
            });
    }

    fetchCities(){
        server.get('cities/', {})
            .then(json => {
                let dataLists = this.state.profileDataLists;
                dataLists.residency.data = json.map((city)=>{
                    return city.name;
                });
                this.setState({profileDataLists: dataLists})
            });
    }

    fetchCircles(){
        server.get('circles/', {})
            .then(json => {
                let dataLists = this.state.profileDataLists;
                dataLists.circle.data = json.map((circle)=>{
                    return circle.name;
                });
                this.setState({profileDataLists: dataLists})
            });
    }

    handleTypedInput = function (name, value, form){
        let activist = this.state.activist;
        if(form === "profile")
            activist.profile[name] = value;
        if(form === "role")
            activist.role[name] = value;
        if(form === "membership")
            activist.membership[name] = value;
        this.setState({activist: activist, unsaved: true});
    }.bind(this);

    lockUser = function() {
        server.post('lock/user', {'userId': this.state._id})
            .then(() => {
                const activist = this.state.activist;
                activist.login.locked = true;
                this.setState({activist});
                alert("locked");
            });
    }.bind(this);

    unlockUser = function() {
        server.post('unlock/user', {'userId': this.state._id})
            .then(() => {
                const activist = this.state.activist;
                activist.login.locked = false;
                this.setState({activist});
                alert("unlocked");
            });
    }.bind(this);

    handlePost = function() {
        if(this.state.savingInProcess)
            return;
        this.setState({savingInProcess: true});
        server.post('activists', {'activists': [this.state.activist]})
            .then(() => {
                alert("saved");
                this.props.history.push('/Organizer');
            });
    }.bind(this);

    render() {
        const activist = this.state.activist;
        const profileFields = this.state.profileFields.slice();
        const roleFields = this.state.roleFields.slice();
        const memberFields = this.state.memberFields.slice();
        const savingInProcess = this.state.savingInProcess;
        const loading = this.state.loadingDetails;
        return (
            <div className={"page-wrap-activist"}>
                <TopNavBar>
                    <div className="title-wrap">
                        {
                            activist.profile
                                ? activist.profile.firstName + " " + activist.profile.lastName
                                :"Loading..."
                        }
                    </div>
                </TopNavBar>
                {
                    loading
                        ? <div className={"loader-wrap"}><LoadSpinner visibility={true}/></div>
                        : <div dir="rtl" className="content-wrap">
                            <h2>פרטי קשר</h2>
                            {activist.profile ? <p>במערכת מאז {activist.metadata.creationDate}</p> : ""}
                            {activist.profile ? <p>עדכון אחרון ב- {activist.metadata.lastUpdate}</p> : ""}
                            {
                                activist.profile ?
                                    <FormSegment
                                        segmentName={"profile"}
                                        dataLists={this.state.profileDataLists}
                                        fields={profileFields}
                                        values={activist.profile}
                                        handleChange={this.handleTypedInput}
                                    /> : null
                            }
                            <h2>הרשאות</h2>
                            {
                                activist.role ?
                                    <FormSegment
                                        segmentName={"role"}
                                        dataLists={this.state.profileDataLists}
                                        fields={roleFields}
                                        values={activist.role}
                                        handleChange={this.handleTypedInput}
                                    /> : null
                            }
                            <h2>חברות בתנועה</h2>
                            {activist.membership ? <p>חברה בתנועה מאז {activist.membership.joiningDate}</p> :
                                <h4>לא בתנועה</h4>}
                            {
                                activist.membership ?
                                    <FormSegment
                                        segmentName={"membership"}
                                        dataLists={this.state.profileDataLists}
                                        fields={memberFields}
                                        values={activist.membership}
                                        handleChange={this.handleTypedInput}
                                    /> : null
                            }
                            <h2>השתתפות באירועים</h2>
                            {
                                (activist.participatedEvents && activist.participatedEvents.length)
                                    ? <p>השתתפו באירועים:</p>
                                    : <h4>לא השתתפו באירועים במערכת</h4>
                            }
                            {
                                (activist.participatedEvents)
                                    ? activist.participatedEvents.map(e =>
                                        <div key={e._id}>
                                            <Link to={`/eventCreation?id=${e._id}`}>
                                                {e.eventDetails.name + ", " + e.eventDetails.date}
                                            </Link>
                                        </div>
                                    )
                                    : null
                            }
                            {
                                activist.login && !activist.login.locked
                                    ? <button type={"button"} onClick={this.lockUser.bind(this)} className="lock-activist-button">
                                        <div className="lock-activist-button-label">
                                            <div>ניתוק ונעילה</div>
                                            <div>ניתוק ונעילה</div>
                                        </div>
                                        <div className="lock-activist-button-icon">
                                            <FontAwesomeIcon icon="lock"/>
                                        </div>
                                    </button>
                                    : null
                            }
                            {
                                activist.login && activist.login.locked
                                    ? <button type={"button"} onClick={this.unlockUser.bind(this)} className="lock-activist-button">
                                        <div className="lock-activist-button-label">
                                            <div>ביטול נעילה</div>
                                            <div>ביטול נעילה</div>
                                        </div>
                                        <div className="lock-activist-button-icon">
                                            <FontAwesomeIcon icon="lock-open"/>
                                        </div>
                                    </button>
                                    : null
                            }
                            {
                                savingInProcess
                                    ? <LoadSpinner visibility={true}/>
                                    :(
                                        <button type={"button"} onClick={this.handlePost.bind(this)} className="save-activist-button">
                                            <div className="save-activist-button-label">
                                                <div>حفظ</div>
                                                <div>שמירה</div>
                                            </div>
                                            <div className="save-activist-button-icon">
                                                <FontAwesomeIcon icon="save"/>
                                            </div>
                                        </button>
                                    )
                            }
                        </div>
                }
            </div>
        )
    }

}

