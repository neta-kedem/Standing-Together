import React from 'react';
import server from '../../services/server';
import './ImportContacts.scss';
import EventPicker from '../../UIComponents/EventPicker/EventPicker';
import ExcelUploader from '../../UIComponents/ExcelUploader/ExcelUploader'

export default class ImportForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onPublish: this.props.onPublish,
            eventId: null,
            contacts: [],
            fields: [
                    {key: "firstName", he: "שם פרטי", ar: "الاسم الشخصي", dir: "right", width: 15},
                    {key: "lastName", he: "שם משפחה", ar: "اسم العائلة", dir: "right", width: 15},
                    {key: "residency", he: "יישוב", ar: "البلد", dir: "right", width: 25},
                    {key: "phone", he: "טלפון", ar: "رقم الهاتف", dir: "left", width: 15},
                    {key: "email", he: "אימייל", ar: "البريد الإلكتروني", dir: "left", width: 30}
                ],
            selectedFile: false
        };
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
                    contact[fields[j].key] = row[j].toString().trim();
                else
                    contact[fields[j].key] = "";
            }
            contact.scanRow = i;
            return contact
        });
        this.setState({selectedFile: true, contacts: contacts});
    }
    handleTypedInput(event, row, field){
        const contacts = this.state.contacts.slice();
        contacts[row][field] = event.target.value;
        this.setState({contacts: contacts})
    }
    handleEventSelection(id){
        this.setState({eventId: id});
    }
    publishScan(){
        const data ={"eventId": this.state.eventId, "activists": this.state.contacts.slice()};
        server.post('contactScan/importActivists', data)
            .then((res) => {
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
            <button className="post-scan-button" onClick={this.publishScan.bind(this)}>העלאת המסמך למערכת</button>
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
                                    return <td key={"contact_" + i + "_" + f.key} style={{"textAlign":f.dir, "width":f.width+"%"}}>
                                        <input value={contact[f.key]} onChange={(e)=>{this.handleTypedInput(e, i, f.key)}}/>
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