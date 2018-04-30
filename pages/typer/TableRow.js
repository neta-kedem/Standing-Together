import React from 'react';
import styles from './TableRow.css'

const display = {
  display: "block"
}

export default class TableRow extends React.Component {
    render() {
      return (
          <tr style={{...styles['list-table-row'],...styles['list-table-field']}}>
            <td style={styles['list-email-field']} type="text" value={this.props.data.mail} onChange={(e) => {
              this.props.handleChangeEvent(e.target.value, this.props.num, 0)
            }}>{this.props.data.mail}</td>
            <td style={styles['list-table-field']} type="text" defaultValue={this.props.data.phone} onChange={(e) => {
              this.props.handleChangeEvent(e.target.value, this.props.num, 1)
            }}>{this.props.data.phone}</td>
            <td style={styles['list-table-field']} type="text" defaultValue={this.props.data.settlement} onChange={(e) => {
              this.props.handleChangeEvent(e.target.value, this.props.num, 2)
            }}>{this.props.data.settlement}</td>
            <td style={styles['list-table-field']} type="text" defaultValue={this.props.data.lname} onChange={(e) => {
              this.props.handleChangeEvent(e.target.value, this.props.num, 3)
            }}>{this.props.data.lname}</td>
            <td style={styles['list-table-field']} type="text" defaultValue={this.props.data.fname} onChange={(e) => {
              this.props.handleChangeEvent(e.target.value, this.props.num, 4)
            }}>{this.props.data.fname}</td>
          </tr>
      );
    }
  }
  