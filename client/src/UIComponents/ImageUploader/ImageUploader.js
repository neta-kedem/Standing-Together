import React from 'react';
import "./ImageUploader.scss";

export default class ImageUploader extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			onSelect: props.onSelect,
			labelText: props.labelText ? props.labelText : "Upload a File"
		}
	}
	static getDerivedStateFromProps(nextProps){
		return {labelText: nextProps.labelText};
	}
	fileSelectionHandler(event)
	{
		this.state.onSelect(event.target.files[0], "scan");
	}
	render() {
		return (
			<div>
				<div className="fileInputWrap">
					<form method="post">
						<div className="upload-btn-wrapper">
							<button type={"button"} className="upload-btn">{this.state.labelText}</button>
							<input required type="file" accept="image/*" onChange={this.fileSelectionHandler.bind(this)}/>
						</div>
					</form>
				</div>
			</div>
		)
	}
}
