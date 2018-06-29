import React from 'react';
import styles from './SelectableRow.css'

const display = {
  display: "block"
}

export default class SelectableRow extends React.Component {
    constructor(props) {
		super(props);
    }
    
    toggleRowSelection() {
        this.props.onSelect();
	}
    render() {
      return (
        <tr style={{...styles['list-table-row'],...styles['list-table-field']}} onClick={() => this.toggleRowSelection()}>
            <td>
              {this.props.data.phone}
            </td>
            <td>
              {this.props.data.settlement}
            </td>
            <td>
              {this.props.data.lname}
            </td>
            <td>
              {this.props.data.fname}
            </td>
            <td style={{...styles['list-row-selection-indicator'], ...(this.props.selected?styles['selected-table-row']:{})}}> </td>
          </tr>
      );
    }
  }
  