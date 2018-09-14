import React from 'react';
import styles from './TableRow.css'

const display = {
  display: "block"
}

export default class TableRow extends React.Component {
	render() {
		return (
			<div style={{...styles['list-table-row'],...styles['list-table-field']}}>
				<td style={styles['list-table-field']}>{this.props.data.firstName}</td>
				<td style={styles['list-table-field']}>{this.props.data.lastName}</td>
				<td style={styles['list-table-field']}>{this.props.data.residency}</td>
				<td style={styles['list-table-field']}>{this.props.data.phone}</td>
				<td style={styles['list-email-field']}>{this.props.data.email}</td>
			</div>
		);
	}
}
  