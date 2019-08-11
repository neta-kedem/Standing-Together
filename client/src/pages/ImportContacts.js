import React from 'react';
import Meta from '../lib/meta';
import style from './importContacts/ImportContacts.scss';
import ImportForm from './importContacts/ImportForm';
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';

export default class ScanContacts extends React.Component {
constructor(props) {
	super(props);
	this.state = {
	};
}
handleUploadSuccess(){
	alert("אנשי הקשר נשמרו במערכת");
}
render() {
	return (
		<div>
			<Meta/>
			<TopNavBar>
				<div className="title-wrap">
					<span className="title-lang">העלאת אנשי קשר</span>
					<span className="title-lang">העלאת אנשי קשר</span>
				</div>
			</TopNavBar>
			<div className="page-wrap">
				<ImportForm onPublish={this.handleUploadSuccess}/>
			</div>
		</div>
	)
}

}