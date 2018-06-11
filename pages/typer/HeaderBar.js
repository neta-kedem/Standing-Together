import React from 'react';
import styles from './HeaderBar.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt } from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faCloudUploadAlt);

export default class HeaderBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sendFunction: props['sendFunction']
		};
		this.handlePost=function() {
			this.state.sendFunction();
		};
	}
	
    render() {
        return (
            <nav style={styles.wrapper}>
                <div style={styles.logo}></div>
                <div style={styles.shortcutblock_copy}>
                    {/*<div style={styles.shortcut_ar}>العربية</div>*/}
                </div>
                <div style={styles.shortcutblock}>
                    <div style={styles.date}>26.02.2018</div>
                </div>
                <div style={styles.shortcutblock}>
                    <div style={styles.shortcut_hb}>ארוע ההחתמה<br/>حدث التوقيع</div>
                </div>
                <div style={styles.shortcutblock}>
                    <div style={styles.shortcut_hb}>שם המארגן<br/>اسم المنظم</div>
                </div>
                <div style={styles.heading_3} onClick={this.handlePost.bind(this)}>
                    <div style={styles.cloud}>שלח<br/>ارسل</div>
                    <FontAwesomeIcon icon="cloud-upload-alt" style={styles['cloud-icon']}/>
                </div>
            </nav>
        )
    }
}
