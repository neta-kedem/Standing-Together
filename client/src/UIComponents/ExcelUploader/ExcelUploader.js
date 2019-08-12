import React from 'react';
import readXLSXFile from 'read-excel-file';
import "./ExcelUploader.scss"

export default class ExcelUploader extends React.Component {
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
