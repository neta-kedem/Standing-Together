import React from 'react';
import styles from './HeaderBar.css'

export default class HeaderBar extends React.Component {
    render() {
        return (
            <nav style={styles.wrapper}>
                <div style={styles.logo}></div>
                <div style={styles.shortcutblock_copy}>
                    <div style={styles.shortcut_ar}>العربية</div>
                </div>
                <div style={styles.shortcutblock}>
                    <div style={styles.shortcut_hb}>26.02.2018</div>
                </div>
                <div style={styles.shortcutblock}>
                    <div style={styles.shortcut_hb}>ארוע ההחתמה</div>
                </div>
                <div style={styles.shortcutblock}>
                    <div style={styles.shortcut_hb}>שם המארגן</div>
                </div>
                <h2 style={styles.heading_3}>
                  <a href="/">Home</a>
                </h2>
            </nav>
        )
    }
}
