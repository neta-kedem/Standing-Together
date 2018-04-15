import React from 'react';
import Meta from '../lib/meta';
import HeaderBar from './typer/HeaderBar'
import TableRow from './typer/TableRow'
import TitleRow from './typer/TitleRow'
import InputFields from './typer/InputFields'
import ItemService from '../services/ItemService'
import styles from './typer/Typer.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faCheckSquare } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faCheckSquare);


export default class Typer extends React.Component {
  constructor() {
    super();
    this.state = {
      data:
          []
    }
    this.addRow = this.addRow.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this)
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

  render() {
    return (
        <div>
          <Meta/>
          <link
			      	href='https://fonts.googleapis.com/css?family=Cabin'
				      rel='stylesheet'
				      type='text/css'
			    ></link>
          <HeaderBar></HeaderBar>
          <section style={styles.section}>
            <div style={styles.rightpanel}>
              <content style={styles.content}>
                  <TitleRow></TitleRow>
                  <table style={styles.info_table}>
                     <tbody style={styles.row}>
                     {this.state.data.map((person, i) => <TableRow key={i} data={person} num={i}
                     handleChangeEvent={this.handleChangeEvent} handleKeyPress={this._handleKeyPress}/>)}
                     </tbody>
                  </table>
                  <div style={styles.selectall}>
                      <div style={styles.awsome_low}><FontAwesomeIcon icon="check-square"></FontAwesomeIcon></div>
                      <h4 style={styles.heading}>select all</h4>
                 </div>
                 <InputFields></InputFields>
                 <div style={styles.input_fields}>
                  <div style={styles.addfilter_copy} onClick={this.addRow}>שלח למסד הנתונים</div>
                </div>
             </content>
            </div>
          </section>
        </div>

    )
  }

}

