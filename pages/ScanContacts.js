import React from 'react';
import Meta from '../lib/meta';
import style from './scanContacts/ScanContacts.css';
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
		<div>
			<Meta/>
			<style jsx global>{style}</style>
			<TopNavBar>
				<div className="scan-page-title-wrap">
					<div className="scan-page-title">
						<div>סריקת דף קשר</div>
						<div>סריקת דף קשר</div>
					</div>
				</div>
			</TopNavBar>
			<div className="page-wrap">
				<ScanForm onPublish={this.handleUploadSuccess}/>
			</div>
		</div>
	)
}

}