import React from 'react';
import InputField from './InputField'
import server from "../../services/server";
import FieldValidation from '../../services/FieldValidation'
import style from './RegistrationForm.css'

export default class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentId: null,
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
        FieldValidation.setFields(this.state.profileFields.slice());
    }
    fetchCities(){
        server.get('cities/', {})
            .then(json => {
                let dataLists = this.state.profileDataLists.slice();
                for(let i=0; i<dataLists.length; i++){
                    if(dataLists[i].field === "residency")
                        dataLists[i].data = json.map((city)=>{
                            return city.name;
                        });
                }
                this.setState({profileDataLists: dataLists})
            });
    }
    handleTypedInput = function (name, value){
        this.state.handleChange(name, value);
    }.bind(this);

    render() {
        const highlightInvalidFields = this.props['highlightInvalidFields'];
        const activistData = this.props.activistData ? this.props.activistData : {};
        const profileFields = this.state.profileFields.slice();
        const inputFields = <div className={"input-fields-container"}>
            {profileFields.map((f)=>{
                return <div className={"input-wrap " + (activistData[f.name+"Valid"] === false ? "invalid" : "")} key={"field_" + f.name} style={{"width":f.width+"%"}}>
                    <InputField
                        field = {f}
                        fieldValue = {activistData[f.name]}
                        handleChange = {this.handleTypedInput.bind(this)}/>
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
            <div className={"registration-form "+(highlightInvalidFields?"highlight-invalid-fields ":"")}>
                <style jsx global>{style}</style>
                {inputFields}
                {dataLists}
            </div>
        );
    }
}