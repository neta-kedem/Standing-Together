import React from 'react';
import InputField from './InputField'
import server from "../../services/server";
import './ContactForm.scss'

export default class ContactForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentId: null,
            lang: props['lang'],
            profileFields: props['profileFields'],
            handleChange: props['handleChange'],
            setValidation: props['setValidation'],
            profileDataLists: [
                {field:"residency", data:[]}
            ],
        };
    }
    componentDidMount() {
        this.fetchCities();
    }
    fetchCities(){
        server.get('cities/', {})
            .then(json => {
                let dataLists = this.state.profileDataLists.slice();
                for(let i=0; i<dataLists.length; i++){
                    if(dataLists[i].field === "residency")
                        dataLists[i].data = json.filter((c=>c.nameHe)).map((city)=>{
                            return city.nameHe;
                        });
                        const arabicNames = json.filter((c=>c.nameAr)).map((city)=>{
                            return city.nameAr;
                        });
                        dataLists[i].data.concat(arabicNames);
                }
                this.setState({profileDataLists: dataLists})
            });
    }
    handleTypedInput = function (name, value){
        this.state.handleChange(name, value);
    }.bind(this);

    render() {
        const activistData = this.props.activistData ? this.props.activistData : {};
        const profileFields = this.state.profileFields.slice();
        const inputFields = <div className={"input-fields-container"}>
            {profileFields.map((f)=>{
                return <div className={"input-wrap " + (activistData[f.name+"Valid"] === false ? "invalid" : "")} key={"field_" + f.name} style={{"width":f.width+"%"}}>
                    <InputField
                        lang = {this.state.lang}
                        field = {f}
                        fieldValue = {activistData[f.name]}
                        handleChange = {this.handleTypedInput.bind(this)}
                    />
                </div>;
            })}
        </div>;
        const dataLists = this.state.profileDataLists?
            this.state.profileDataLists.map((f)=>{
                return <datalist key={f.field+"-data-list"} id={f.field+"-data-list"}>
                    {f.data.map((option)=>{
                        return <option key={f.field+"-op-"+option} value={option}/>
                    })}
                </datalist>
            })
            :"";
        return (
            <div className={"registration-form"}>
                {inputFields}
                {dataLists}
            </div>
        );
    }
}