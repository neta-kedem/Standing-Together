import React from 'react';
import styles from './TitleRow.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faBuilding, faEnvelopeOpen, faPhone, faUser } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faBuilding);
fontawesome.library.add(faEnvelopeOpen);
fontawesome.library.add(faPhone);
fontawesome.library.add(faUser);


export default class TitleRow extends React.Component {
    render() {
      return (
        <div style={styles.row_title}>
            <div style={styles.rtl}>
                <h4 style={styles.heading_hb}>מייל/البريد الإلكتروني</h4>
                <div style={styles.awsome_hb_low}><FontAwesomeIcon icon="envelope-open"></FontAwesomeIcon></div>
            </div>
            <div style={styles.rtl}>
                <h4 style={styles.heading_hb}>טלפון/رقم الهاتف</h4>
                <div style={styles.awsome_hb_low}><FontAwesomeIcon icon="phone"></FontAwesomeIcon></div>
            </div>
            <div style={styles.rtl}>
                <h4 style={styles.heading_hb}>עיר/البلد</h4>
                <div style={styles.awsome_hb_low}><FontAwesomeIcon icon="building"></FontAwesomeIcon></div>
            </div>
            <div style={styles.rtl}>
                <h4 style={styles.heading_hb}>שם משפחה/اسم العائلة</h4>
                <div style={styles.awsome_hb_low}><FontAwesomeIcon icon="user"></FontAwesomeIcon></div>
            </div>
            <div style={styles.rtl}>
                <h4 style={styles.heading_hb}>שם/الاسم</h4>
                <div style={styles.awsome_hb_low}><FontAwesomeIcon icon="user"></FontAwesomeIcon></div>
            </div>
      </div>
      );
    }
  }
  