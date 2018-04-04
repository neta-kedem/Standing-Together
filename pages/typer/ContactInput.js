import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import CreateReactClass from 'create-react-class';
import '../Typers.css.js';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import ReactDOM from 'react-dom';


   export default class App extends React.Component {
   constructor() {
      super();
      this.state = {
         data:
         [
            {
               "fname":"",
               "lname":"",
               "settlement":"",
               "phone":"",
               "mail":""
            }
         ]
      }
      this.addRow = this.addRow.bind(this);
   };
   addRow(){
      var input = document.createElement("input");
      var item = [{
               "fname":input,
               "lname":input,
               "settlement":input,
               "phone":input,
               "mail":input
            }]
      this.setState({ data: [...this.state.data,item] });
   }
   handleChangeEvent = (value, cell, index) => {
        let newState = this.state.data.slice(0);
        newState[cell][index] = value;
        this.setState({data: newState});

    };
   render() {
      return (
         <div class="col-md-9 col-md-offset-3">
            <table className="table table-bordered">
                <thead>
                    <tr className="tr1">
                       <th scope="col">שם פרטי</th>
                       <th scope="col">שם משפחה</th>
                       <th scope="col">יישוב</th>
                       <th scope="col">טלפון</th>
                       <th scope="col">מייל</th>
                    </tr>
               </thead>
               <tbody>
                  {this.state.data.map((person, i) => <TableRow key = {i}
                     data = {person} num = {i} handleChangeEvent={this.handleChangeEvent} onClick = {this.addRow} />)}
               </tbody>
            </table>
         </div>
      );
   }
}
class Header extends React.Component {
   render() {
      return (
         <div>
            <h1>Header</h1>
         </div>
      );
   }
}
class TableRow extends React.Component {
   render() {
      return (
         <tr className="tr1">
            <td className="td1"><input type="text" defaultValue={this.props.data.fname} onChange={(e) => {
                        this.props.handleChangeEvent(e.target.value, this.props.num, 0)
                    }} /></td>
            <td className="td1"><input type="text" defaultValue={this.props.data.lname} onChange={(e) => {
                        this.props.handleChangeEvent(e.target.value, this.props.num, 1)
                    }} /></td>
            <td className="td1"><input type="text" defaultValue={this.props.data.settelment} onChange={(e) => {
                        this.props.handleChangeEvent(e.target.value, this.props.num, 2)
                    }} /></td>
            <td className="td1"><input type="text" defaultValue={this.props.data.phone} onChange={(e) => {
                        this.props.handleChangeEvent(e.target.value, this.props.num, 2)
                    }} /></td>
            <td className="td1"><input type="text" defaultValue={this.props.data.mail} onChange={(e) => {
                        this.props.handleChangeEvent(e.target.value, this.props.num, 2)
                    }} onClick = {this.props.onClick} /></td>
         </tr>
      );
   }
}
