import React from 'react';
import Router from 'next/router';
import Meta from '../lib/meta';

import config from '../config';
import server from '../services/server';
import style from './scanContacts/ScanContacts.css';
import RowSelector from './scanContacts/TableRowSelector';
import TableScanner from '../UIComponents/TableScanner/TableScanner';
import ImageUploader from '../UIComponents/ImageUploader/ImageUploader';
import ImageCropper from '../UIComponents/ImageCropper/ImageCropper';
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';
import Popup from '../UIComponents/Popup/Popup';

export default class ScanContacts extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		selectedImage: false,
		croppedImage: false,
		normalizedImg: false,
		scanUrl: null,
		horizontalBorders: [],
		verticalBorders: [],
		detectedCells: [],
		scanFailed: false,
		width: 1000,
		height: 1000,
	};
}
handleImageSelection(file) {
	this.setState({selectedImage: file});
}
handleImageCrop(img) {
	this.setState({croppedImage: img});
}
handleTableDetection(img, width, height, cells, horizontalBorders, verticalBorders){
	this.setState({normalizedImg: img, width:width, height:height, detectedCells: cells, horizontalBorders:horizontalBorders, verticalBorders:verticalBorders});
}
handleDetectionFailure(img, width, height, cause){
	this.setState({normalizedImg: img, width:width, height:height, scanFailed: true});
}
handlePost(){
	var formWrap = new FormData();
	formWrap.append("scan", this.state.normalizedImg);
	var promise = fetch(config.serverPath+"api/contactScan/upload", {
		headers: {
			'Accept': 'application/json, application/xml, text/play, text/html, *.*'
		},
		credentials: 'same-origin',
		method: 'POST',
		body: formWrap
	})
	.then(res => res.json())
	.then(json => {
		this.publishScan(json.url);
	});
}
publishScan(imgUrl){
	const data ={"scanUrl":imgUrl, "cells":this.state.detectedCells,};
	server.post('contactScan', data)
	.then(json => {
		this.setState({
				selectedImage: false,
				croppedImage: false,
				normalizedImg: false,
				scanUrl: null,
				horizontalBorders: [],
				verticalBorders: [],
				detectedCells: [],
				width: 1000,
				height: 1000
			});
		alert("המסמך נשמר בהצלחה, ויוצג לקלדנים");
	});
}
render() {
	const selectedImage = this.state.selectedImage;
	const croppedImage = this.state.croppedImage;
	const cells = this.state.detectedCells;
	const imgUploadUI = <div className="contact-scan-uploader">
			<ImageUploader onSelect={this.handleImageSelection.bind(this)} labelText="⇪ העלאת סריקת דף קשר ⇪"/>
		</div>;
	const imgCropperUI =
		<div>
			<div className="contact-scan-step-title">
				<div>יש לחתוך את הסריקה כך שלא יישארו קצוות מעבר לנייר</div>
				<div>יש לחתוך את הסריקה כך שלא יישארו קצוות מעבר לנייר</div>
			</div>
			<div className="contact-scan-step-wrap"><ImageCropper file={selectedImage} onCrop={this.handleImageCrop.bind(this)}/></div>
		</div>
	const tableScannerUI = 
		<div>
			<div className="contact-scan-step-title">
				<div>המסמך נסרק...</div>
				<div>המסמך נסרק...</div>
			</div>
			<div className="contact-scan-step-wrap"><TableScanner src={croppedImage} onDetection={this.handleTableDetection.bind(this)} onFail={this.handleDetectionFailure.bind(this)}/></div>
		</div>
	const rowSelectorUI = 
		<div>
			<div className="contact-scan-step-title">
				<div>הסריקה הסתיימה. אם חלק מהרשומות ריקות, נא לסמן אותן</div>
				<div>הסריקה הסתיימה. אם חלק מהרשומות ריקות, נא לסמן אותן</div>
			</div>
			<div className="contact-scan-step-wrap"><RowSelector src={croppedImage} width={this.state.width} height={this.state.height} cells={cells} horizontalBorders={this.state.horizontalBorders} verticalBorders={this.state.verticalBorders}/></div>
		</div>
	const postButton = <button className="post-scan-button" onClick={this.handlePost.bind(this)}>העלאת המסמך למערכת</button>
	const failedScanPopup = <div className="failed-scan-popup">
		<Popup visibility={this.state.scanFailed} toggleVisibility={()=>{}}>
			<div className="failed-scan-popup-label">
				<div>זיהוי אוטומטי של הטבלה לא הצליח</div>
				<div>זיהוי אוטומטי של הטבלה לא הצליח</div>
			</div>
			<div>
				<button>העלאה ללא זיהוי טבלה</button>
				<button>בחירת קובץ אחר</button>
			</div>
		</Popup></div>
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
				{!selectedImage?imgUploadUI:""}
				{(selectedImage&&!croppedImage)?imgCropperUI:""}
				{!failedScanPopup&&croppedImage&&!cells.length?tableScannerUI:""}
				{!failedScanPopup&&croppedImage&&cells.length?rowSelectorUI:""}
				{!failedScanPopup&&croppedImage&&cells.length?postButton:""}
				{failedScanPopup}
			</div>
		</div>
	)
}

}