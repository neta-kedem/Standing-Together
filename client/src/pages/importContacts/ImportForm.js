import React from 'react';
import server from '../../services/server';
import FieldValidation from '../../services/FieldValidation'
import './ImportContacts.scss';
import EventPicker from '../../UIComponents/EventPicker/EventPicker';
import ExcelUploader from '../../UIComponents/ExcelUploader/ExcelUploader'
import PubSub from "pubsub-js";
import events from "../../lib/events";

export default class ImportForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onPublish: this.props.onPublish,
            pendingServerResponse: false,
            eventId: null,
            contacts: [],
            fields: [
                {
                    name: "firstName", he: "שם פרטי", ar: "الاسم الشخصي", dir: "right", width: 15,
                    validation: /^.{2,}$/,
                    required: true},
                {
                    name: "lastName", he: "שם משפחה", ar: "اسم العائلة", dir: "right", width: 15,
                    required: false
                },
                {
                    name: "residency", he: "יישוב", ar: "البلد", dir: "right", width: 25,
                    validation: /^.{2,}$/,
                    required: false
                },
                {
                    name: "phone", he: "טלפון", ar: "رقم الهاتف", dir: "left", width: 15,
                    validation: /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,}$/,
                    required: false
                },
                {
                    name: "email", he: "אימייל", ar: "البريد الإلكتروني", dir: "left", width: 30,
                    validation: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    required: false
                }
                ],
            selectedFile: false,
            postAttempted: false
        };
    }
    componentDidMount() {
        this.ActivistFieldsValidation = new FieldValidation();
        this.ActivistFieldsValidation.setFields(this.state.fields.slice());
    }

    handleDataSelection(data) {
        if(!data.length){
            this.setState({selectedFile: false})
        }
        data.splice(0, 1);
        const fields = this.state.fields.slice();
        const contacts = data.map((row, i)=>{
            const contact = {};
            for(let j = 0; j < fields.length; j++){
                if(row[j])
                    contact[fields[j].name] = row[j].toString().trim();
                else
                    contact[fields[j].name] = "";
                contact[fields[j].name + "Valid"] = this.ActivistFieldsValidation.validate(contact[fields[j].name], fields[j].name);
            }
            contact.scanRow = i;
            return contact
        });
        this.setState({selectedFile: true, contacts: contacts});
    }
    handleTypedInput(event, row, field){
        const contacts = this.state.contacts.slice();
        contacts[row][field] = event.target.value;
        contacts[row][field + "Valid"] = this.ActivistFieldsValidation.validate(event.target.value, field);
        this.setState({contacts: contacts})
    }
    handleEventSelection(id){
        this.setState({eventId: id});
    }
    publishScan(){
        if(this.state.pendingServerResponse)
            return;
        this.setState({pendingServerResponse: true});
        const contacts = this.state.contacts.slice();
        if(!this.ActivistFieldsValidation.validateAll(contacts)){
            this.setState({postAttempted: true});
            PubSub.publish(events.alert, {content: <div dir={"rtl"}>
                <p>חלק מהשדות אינם תקינים - וודאו שלא חסרים שמות פרטיים או שמות משפחה, ושמספרי הטלפון וכתובות האימייל בפורמט נכון</p>
                <p>חלק מהשדות אינם תקינים - וודאו שלא חסרים שמות פרטיים או שמות משפחה, ושמספרי הטלפון וכתובות האימייל בפורמט נכון</p>
            </div>});
            return;
        }
        const data ={"eventId": this.state.eventId, "activists": contacts};
        server.post('contactScan/importActivists', data)
            .then((res) => {
                this.setState({pendingServerResponse: false});
                if(res.err){
                    alert(res.err);
                    return;
                }
                this.reset();
                this.state.onPublish();
            });
    }
    reset() {
        this.setState ({
            selectedFile: false,
            eventId: null,
            contacts: [],
        });
    }
    render() {
        const contacts = this.state.contacts.slice();
        const fields = this.state.fields.slice();
        const selectedFile = this.state.selectedFile;
        const eventId = this.state.eventId;
        const excelUploadUI = <div className="contact-scan-uploader">
            <ExcelUploader onSelect={this.handleDataSelection.bind(this)} labelText={selectedFile ? "⇪ העלאה מחדש ⇪" : "⇪ העלאת אנשי קשר ⇪" }/>
        </div>;
        const postButton = <div className={"post-scan-wrap " + (contacts.length > 0 && eventId ? "active " : "")}>
            <button type={"button"} className="post-scan-button" onClick={this.publishScan.bind(this)}>העלאת המסמך למערכת</button>
        </div>;
        const contactsPreview = <div>{
            <table className={"contacts-table"}>
                <thead>
                    <tr>
                        {
                            fields.map((f, i)=>{
                                return <th key={"field_" + i}>{f.ar + " - " + f.he}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                {
                    contacts.map((contact, i)=>{
                        return <tr key={"contact_" + i}>
                            {
                                fields.map(f=>{
                                    return <td key={"contact_" + i + "_" + f.name}
                                               style={{
                                                   "textAlign": f.dir,
                                                   "direction": f.dir === "left" ? "ltr" : "rtl",
                                                   "width": f.width+"%"
                                               }}
                                               className={(!contact[f.name + "Valid"] && this.state.postAttempted)?"invalid-field":""}>
                                        <input
                                            value={contact[f.name]}
                                            onChange={(e)=>{this.handleTypedInput(e, i, f.name)}}
                                        />
                                    </td>
                                })
                            }
                        </tr>;
                    })
                }
                </tbody>
            </table>
        }</div>;
        return (
            <div dir={"rtl"}>
                <div className={"main-content"}>
                    <div className="event-selection-wrap">
                        <h3>בחרו את האירוע שבמסגרתו נאספו אנשי הקשר</h3>
                        <EventPicker handleSelection={this.handleEventSelection.bind(this)} selected={this.state.eventId}/>
                    </div>
                    <div className="import-excel-wrap">
                        <h3>העלו רשימת אנשי קשר</h3>
                        {contacts.length ? contactsPreview : ""}
                        {excelUploadUI}
                    </div>
                    {postButton}
                </div>
            </div>
        )
    }

}