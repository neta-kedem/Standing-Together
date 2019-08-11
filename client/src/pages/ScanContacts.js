import React from 'react';
import './scanContacts/ScanContacts.scss';
import ScanForm from './scanContacts/ScanForm';
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';

export default class ScanContacts extends React.Component {
constructor(props) {
	super(props);
	this.state = {
	};
}
handleUploadSuccess(id){
	alert("המסמך נשמר בהצלחה, ויוצג לקלדנים");
}
render() {
	return (
		<div className={"page-wrap-scan-contacts"}>
			<TopNavBar>
				<div className="title-wrap">
					<span className="title-lang">مسح صفحات اتصال</span>
					<span className="title-lang">סריקת דפי קשר</span>
				</div>
			</TopNavBar>
			<div className="page-wrap">
				<ScanForm onPublish={this.handleUploadSuccess}/>
			</div>
		</div>
	)
}

}