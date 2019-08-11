import React from 'react';
import readXLSXFile from 'read-excel-file';
export default class ExcelUploader extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			onSelect: props.onSelect,
			labelText: props.labelText ? props.labelText : "Upload a File"
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState(
			{labelText: nextProps.labelText}
		);
	}
	fileSelectionHandler(event)
	{
		const file = event.target.files[0];
		if(file.name.indexOf(".xls") !== -1) {
			readXLSXFile(file).then(data => {
				this.state.onSelect(data);
			});
		}
		else if(file.name.indexOf(".csv") !== -1){
			const reader = new FileReader();
			reader.onload = ()=>{
				const result = reader.result;
				//TODO: replace with more robust CSV parsing
				const rows = result.split("\n");
				const cells = rows.map(row => row.split(","));
				this.state.onSelect(cells);
			};
			reader.readAsText(file, "UTF-8");
		}
	}
	render() {
		return (
			<div>
				<style>{/**
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
					    height: 3.5em;
						position: absolute;
						left: 0;
						top: 0;
						opacity: 0;
					}**/}</style>
				<div className="fileInputWrap">
					<form method="post">
						<div className="upload-btn-wrapper">
							<button className="upload-btn">{this.state.labelText}</button>
							<input required type="file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={this.fileSelectionHandler.bind(this)}/>
						</div>
					</form>
				</div>
			</div>
		)
	}
}
