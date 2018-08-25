import React from 'react';
import config from '../../config';
export default class ImageUploader extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			onSelect: props.onSelect
		}
	}
	fileSelectionHandler(event)
	{
		var formWrap = new FormData();
		formWrap.append('scan', event.target.files[0]);
		fetch(config.serverPath+"api/contactScan", {
			headers: {
				'Accept': 'application/json, application/xml, text/play, text/html, *.*'
			},
			credentials: 'same-origin',
			method: 'POST',
			body: formWrap
		})
		//not sure why this doesn't work:
		//server.uploadFile("contactScan", event.target.files[0], "scan");
		//server call request body shows just "object[formData]"
	}
	render() {
		return (
			<div className="fileInputWrap">
				<form method="post">
					<input required type="file" onChange={this.fileSelectionHandler.bind(this)}/>
				</form>
			</div>
		)
	}
}
