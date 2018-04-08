import React from 'react';
import styles from './TableRow.css'

const display = {
  display: "block"
}

export default class TableRow extends React.Component {
    render() {
      return (
          <tr style={display}>
            <td><input style={styles.input_Style} type="text" value={this.props.data.mail} onChange={(e) => {
              this.props.handleChangeEvent(e.target.value, this.props.num, 0)
            }}/></td>
            <td><input style={styles.input_Style} type="text" defaultValue={this.props.data.phone} onChange={(e) => {
              this.props.handleChangeEvent(e.target.value, this.props.num, 1)
            }}/></td>
            <td><input style={styles.input_Style} type="text" defaultValue={this.props.data.settlement} onChange={(e) => {
              this.props.handleChangeEvent(e.target.value, this.props.num, 2)
            }}/></td>
            <td><input style={styles.input_Style} type="text" defaultValue={this.props.data.lname} onChange={(e) => {
              this.props.handleChangeEvent(e.target.value, this.props.num, 2)
            }}/></td>
            <td><input style={styles.input_Style} type="text" defaultValue={this.props.data.fname} onChange={(e) => {
              this.props.handleChangeEvent(e.target.value, this.props.num, 2)
            }}/></td>
          </tr>
      );
    }
  }
  