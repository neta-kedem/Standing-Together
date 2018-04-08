import React from 'react';
import styles from './Title.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faBuilding, faEnvelopeOpen, faPhone, faUser } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faBuilding);
fontawesome.library.add(faEnvelopeOpen);
fontawesome.library.add(faPhone);
fontawesome.library.add(faUser);


export default class Title extends React.Component {
    render() {
      return (
        
            <div style={styles.rtl}>
                <h4 style={styles.heading_hb}>{this.props.title}</h4>
                <div style={styles.awsome_hb_low}><FontAwesomeIcon icon={this.props.icon}></FontAwesomeIcon></div>
            </div>
   
      );
    }
  }
  