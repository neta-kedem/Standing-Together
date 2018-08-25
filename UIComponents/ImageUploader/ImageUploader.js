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
		this.state.onSelect(event.target.files[0], "scan");
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
