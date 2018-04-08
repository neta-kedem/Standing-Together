import React from 'react';
import style from './typer/Typers.css'
import style2 from './typer/ContactInput.css';


export default class App extends React.Component {
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
    var fname = String(document.getElementById("firstName").value);
    var lname = document.getElementById("lastName").value;
    var mail = document.getElementById("mail").value;
    var city = document.getElementById("city").value;
    var phone = document.getElementById("phNo").value;
    console.log(fname);
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
    console.log(this.state.data);
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
          <Header/>
          <section className="section-2">
            <div className="rightpanel">
              <content className="content">
                <div className="row title">
                  <div className="email1 rtl">
                    <h4 className="heading-hb">מייל</h4>
                    <div className="awsome-hb low"></div>
                  </div>
                  <div className="phoneno rtl">
                    <h4 className="heading-hb">טלפון</h4>
                    <div className="awsome-hb low"></div>
                  </div>
                  <div className="lives-in rtl">
                    <h4 className="heading-hb">עיר</h4>
                    <div className="awsome-hb low"></div>
                  </div>
                  <div className="lastname rtl">
                    <h4 className="heading-hb">שם משפחה</h4>
                    <div className="awsome-hb low"></div>
                  </div>
                  <div className="name rtl">
                    <h4 className="heading-hb">שם</h4>
                    <div className="awsome-hb low"></div>
                  </div>
                </div>
                <div className="col-md-offset-3">
                  <table className="info-table">
                    <tbody className="row">
                    {this.state.data.map((person, i) => <TableRow key={i}
                                                                  data={person} num={i}
                                                                  handleChangeEvent={this.handleChangeEvent}
                                                                  handleKeyPress={this._handleKeyPress}/>)}
                    </tbody>
                  </table>
                </div>
                <div className="selectall">
                  <div className="awsome low"></div>
                  <h4 className="heading">select all</h4>
                </div>
                <div className="input-fields">
                  <div className="row-copy">
                    <div className="lives-in rtl">
                      <h4 className="heading-hb">עיר</h4>
                      <div className="awsome-hb low"></div>
                    </div>
                    <input className="lives-in table-copy-2" id="city">

                    </input>
                  </div>
                  <div className="row-copy">
                    <div className="lastname rtl">
                      <h4 className="heading-hb">שם משפחה</h4>
                      <div className="awsome-hb low"></div>
                    </div>
                    <input className="lastname table-copy-2" id="lastName">

                    </input>
                  </div>
                  <div className="row-copy">
                    <div className="name rtl">
                      <h4 className="heading-hb">שם</h4>
                      <div className="awsome-hb low"></div>
                    </div>
                    <input className="name table-hb-copy" id="firstName">

                    </input>
                  </div>
                </div>
                <div className="input-fields">
                  <div className="row-copy">
                    <div className="email1 rtl">
                      <h4 className="heading-hb">מייל</h4>
                      <div className="awsome-hb low"></div>
                    </div>
                    <input className="email table-copy" id="mail">

                    </input>
                  </div>
                  <div className="row-copy">
                    <div className="phoneno rtl">
                      <h4 className="heading-hb">טלפון</h4>
                      <div className="awsome-hb low"></div>
                    </div>
                    <input className="phoneno table-copy-2" id="phNo" onKeyPress={this._handleKeyPress}>

                    </input>
                  </div>
                </div>
                <div className="input-fields">
                  <div className="addfilter-copy" onClick={this.addRow}>שלח למסד הנתונים</div>
                </div>
              </content>
            </div>
          </section>
        </div>

    );
  }
}

class Header extends React.Component {
  render() {
    return (
        <div>
          <nav className="topbar">
            <div className="logo"></div>
            <div className="shortcutblock-copy">
              <div className="shortcut-ar">العربية</div>
            </div>
            <div className="shortcutblock">
              <div className="shortcut-hb">26.02.2018</div>
            </div>
            <div className="shortcutblock">
              <div className="shortcut-hb">ארוע ההחתמה</div>
            </div>
            <div className="shortcutblock">
              <div className="shortcut-hb">שם המארגן</div>
            </div>
            <h2 className="heading-3">
              <a href="/">Home</a>
            </h2>
          </nav>
        </div>
    );
  }
}

class TableRow extends React.Component {
  render() {
    return (
        <tr>
          {console.log(this.props.data)}
          <td className="constW"><input type="text" value={this.props.data.fname} onChange={(e) => {
            this.props.handleChangeEvent(e.target.value, this.props.num, 0)
          }}/></td>
          <td className="constW"><input type="text" defaultValue={this.props.data.lname} onChange={(e) => {
            this.props.handleChangeEvent(e.target.value, this.props.num, 1)
          }}/></td>
          <td className="constW"><input type="text" defaultValue={this.props.data.settlement} onChange={(e) => {
            this.props.handleChangeEvent(e.target.value, this.props.num, 2)
          }}/></td>
          <td className="constW"><input type="text" defaultValue={this.props.data.phone} onChange={(e) => {
            this.props.handleChangeEvent(e.target.value, this.props.num, 2)
          }}/></td>
          <td className="constW"><input type="text" defaultValue={this.props.data.mail} onChange={(e) => {
            this.props.handleChangeEvent(e.target.value, this.props.num, 2)
          }}/></td>
        </tr>
    );
  }
}
