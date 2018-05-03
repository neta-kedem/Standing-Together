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
             <tr style={{...styles['list-table-row'],...styles['list-table-field'],...styles['right-to-left']}}>
                <td style={styles['td-style']}> 
                    <input style={styles['list-email-field']} type="text" tabIndex={5} defaultValue="" id="mail" onKeyPress={this.props.handleKeyPress}/>
                </td>
                <td style={styles['td-style']}> 
                    <input style={styles['list-table-field']} type="text" tabIndex={4} defaultValue="" id="phNo" onKeyPress={this.props.handleKeyPress}/>
                </td>
                <td style={styles['td-style']}> 
                    <input style={styles['list-table-field']} type="text" tabIndex={3} defaultValue="" id="city" onKeyPress={this.props.handleKeyPress}/>
                </td>
                <td style={styles['td-style']}> 
                    <input style={styles['list-table-field']} type="text" tabIndex={2} defaultValue="" id="lastName" onKeyPress={this.props.handleKeyPress}/>
                </td>
                <td style={styles['td-style']}> 
                    <input style={styles['list-table-field']} type="text" tabIndex={1} defaultValue="" id="firstName" onKeyPress={this.props.handleKeyPress}/>
                </td>
             </tr>
          </tbody>
        </table>
      );
    }
  }
  