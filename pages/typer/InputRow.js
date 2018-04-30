import React from 'react';
import styles from './InputRow.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faSave);

const display = {
  display: "block"
}

export default class InputRow extends React.Component {
    render() {
      return (
        <table style={styles.info_table}>
          <tbody style={styles.row}>
             <tr style={{...styles['list-table-row'],...styles['list-table-field']}}>
                <td style={styles['td-style']}> 
                    <input style={styles['list-email-field']} type="text" defaultValue="" id="mail"/>
                </td>
                <td style={styles['td-style']}> 
                    <input style={styles['list-table-field']} type="text" defaultValue="" id="phNo"/>
                </td>
                <td style={styles['td-style']}> 
                    <input style={styles['list-table-field']} type="text" defaultValue="" id="city"/>
                </td>
                <td style={styles['td-style']}> 
                    <input style={styles['list-table-field']} type="text" defaultValue="" id="lastName"/>
                </td>
                <td style={styles['td-style']}> 
                    <input style={styles['list-table-field']} type="text" defaultValue="" id="firstName"/>
                </td>
             </tr>
          </tbody>
        </table>
      );
    }
  }
  