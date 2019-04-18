import React from 'react';
import config from '../../services/config';
export default class ImageUploader extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			onSelect: props.onSelect,
			labelText: props.labelText?props.labelText:"Upload a File"
		}
	}
	fileSelectionHandler(event)
	{
		this.state.onSelect(event.target.files[0], "scan");
	}
	render() {
		return (
			<div>
				<style jsx global>{`
					.upload-btn-wrapper {
						position: relative;
						overflow: hidden;
						display: inline-block;
						background-color: #90278e;
						cursor: pointer;
						transition: background-color 0.25s;
					}
					.upload-btn-wrapper:hover{
						background-color: #731f72;
					}
					.upload-btn-wrapper:active{
						background-color: #561755;
					}
					.upload-btn {
						border: none;
						color: white;
						background-color: rgba(0, 0, 0, 0);
						padding: 0.25em 0.75em;
						font-size: 1.5em;
					}
					.upload-btn-wrapper input[type=file] {
						font-size: 100px;
						position: absolute;
						left: 0;
						top: 0;
						opacity: 0;
					}
				`}</style>
				<div className="fileInputWrap">
					<form method="post">
						<div className="upload-btn-wrapper">
							<button className="upload-btn">{this.state.labelText}</button>
							<input required type="file" accept="image/*" onChange={this.fileSelectionHandler.bind(this)}/>
						</div>
					</form>
				</div>
			</div>
		)
	}
}
