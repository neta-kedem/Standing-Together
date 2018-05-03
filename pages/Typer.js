import React from 'react';
import Meta from '../lib/meta';
import HeaderBar from './typer/HeaderBar'
import TableRow from './typer/TableRow'
import TitleRow from './typer/TitleRow'
import InputFields from './typer/InputFields'
import InputRow from './typer/InputRow'
import ItemService from '../services/ItemService'
import styles from './typer/Typer.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faCheckSquare } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faCheckSquare);
import { faSave } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faSave);
import { faTrashAlt } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faTrashAlt);



export default class Typer extends React.Component {
  constructor() {
    super();
    this.state = {
      data:
          []
    }
    this.addRow = this.addRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
  };

  addRow() {
    var input = document.createElement("input");
    var fname = document.getElementById("firstName").value;
    var lname = document.getElementById("lastName").value;
    var mail = document.getElementById("mail").value;
    var city = document.getElementById("city").value;
    var phone = document.getElementById("phNo").value;
    var item = {
      "fname": fname,
      "lname": lname,
      "settlement": city,
      "phone": phone,
      "mail": mail
    }
    this.setState((prevState, props) => ({
      data: [...prevState.data, item]
    }));
  };

  myFunction = () => {
    this.props.updateItem(this.state)
  };

  handleChangeEvent = (value, cell, index) => {
    let newState = this.state.data.slice(0);
    newState[cell][index] = value;
    this.setState({data: newState});
  };

  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.addRow();
    }
  };

  deleteRow(index){
    var contacts = [...this.state.data];
    contacts.splice(Number(index), 1);
    this.setState((props) => ({
      data: contacts
    }));
  };

  render() {
    return (
        <div>
          <Meta/>
          <HeaderBar></HeaderBar>
          <section style={styles.section}>
            <div style={styles.rightpanel}>
              <content style={styles.content}>
                  <TitleRow></TitleRow>
                  <div style={styles['save-div']}>
                    <span onClick ={this.addRow}><FontAwesomeIcon id = "save" icon="save" style={styles['save-btn']}/></span>
                    <InputRow handleKeyPress={this._handleKeyPress}></InputRow>
                  </div>
                  <br/>
                  <br/>

                  <table style={styles.info_table}>
                     <tbody style={styles.row}>
                     {
                       this.state.data.map((person, i) =>
                       <div>
                         <FontAwesomeIcon onClick ={this.deleteRow.bind(this,i)}  key={i+0.1} id="delete" icon="trash-alt" style={styles['save-btn']}/>
                         <TableRow key={i} data={person} num={i}
                         handleChangeEvent={this.handleChangeEvent} handleKeyPress={this._handleKeyPress}/></div>)}
                     </tbody>
                  </table>
                  {/*<div style={styles.selectall}>
                      <div style={styles.awsome_low}><FontAwesomeIcon icon="check-square"></FontAwesomeIcon></div>
                      <h4 style={styles.heading}>select all</h4>
                 </div>
                 <div style={styles.input_fields}>
                <div style={styles.addfilter_copy}>שלח למסד הנתונים</div>
                </div>*/}
             </content>
            </div>
          </section>
        </div>

    )
  }

}

