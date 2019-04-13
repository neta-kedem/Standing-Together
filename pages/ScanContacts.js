import React from 'react';
import Meta from '../lib/meta';

import config from '../services/config';
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
		selectedImageSrc: false,
		croppedImage: false,
		normalizedImg: false,
		scanUrl: null,
		horizontalBorders: [],
		verticalBorders: [],
		detectedCells: [],
        dataCells: [],
		scanFailed: false,
		width: 1000,
		height: 1000,
	};
}
handleImageSelection(file) {
	const reader = new FileReader();
	reader.onload = ()=>{
		this.setState({selectedImageSrc: reader.result});
	};
	reader.readAsDataURL(file);
	this.setState({selectedImage: file});
}
handleImageCrop(img) {
	this.setState({croppedImage: img});
}
handleTableDetection(img, width, height, cells, horizontalBorders, verticalBorders){
	this.setState({normalizedImg: img, width:width, height:height, detectedCells: cells, horizontalBorders:horizontalBorders, verticalBorders:verticalBorders});
}
handleDetectionFailure(img, width, height, cause){
	console.log(cause);
	this.setState({normalizedImg: img, width:width, height:height, scanFailed: true});
}
handleRowSelection(rows){
    this.setState({dataCells: rows});
}
handlePost(){
	const formWrap = new FormData();
	formWrap.append("scan", this.state.selectedImage);
	fetch(config.serverPath+"api/contactScan/upload", {
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
	const data ={"scanUrl":imgUrl, "cells":this.state.dataCells};
	server.post('contactScan', data)
	.then(() => {
		this.reset();
		alert("המסמך נשמר בהצלחה, ויוצג לקלדנים");
	});
}
reset() {
	this.setState ({
		selectedImage: false,
		selectedImageSrc: false,
		croppedImage: false,
		normalizedImg: false,
		scanUrl: null,
		horizontalBorders: [],
		verticalBorders: [],
		detectedCells: [],
		scanFailed: false,
		width: 1000,
		height: 1000,
	});
}
render() {
	const selectedImage = this.state.selectedImage;
	const croppedImage = this.state.croppedImage;
	const cells = this.state.detectedCells;
	const selectedCells = this.state.dataCells;
	const scanFailed = this.state.scanFailed;
	const imgUploadUI = <div className="contact-scan-uploader">
			<ImageUploader onSelect={this.handleImageSelection.bind(this)} labelText="⇪ העלאת סריקת דף קשר ⇪"/>
		</div>;
	const imgCropperUI =
		<div>
			<div className="contact-scan-step-title">
				<div>יש לחתוך את הסריקה כך שלא יישארו קצוות מעבר לנייר</div>
				<div>יש לחתוך את הסריקה כך שלא יישארו קצוות מעבר לנייר</div>
			</div>
			<div className="contact-scan-step-wrap">
                <ImageCropper file={selectedImage} onCrop={this.handleImageCrop.bind(this)}/>
			</div>
		</div>;
	const tableScannerUI = 
		<div>
			<div className="contact-scan-step-title">
				<div>המסמך נסרק...</div>
				<div>המסמך נסרק...</div>
			</div>
			<div className="contact-scan-step-wrap">
                <TableScanner
                    src={croppedImage}
                    onDetection={this.handleTableDetection.bind(this)}
                    onFail={this.handleDetectionFailure.bind(this)}/>
			</div>
		</div>;
	const rowSelectorUI = 
		<div>
			<div className="contact-scan-step-title">
				<div>הסריקה הסתיימה. אם חלק מהרשומות ריקות, נא לסמן אותן</div>
				<div>הסריקה הסתיימה. אם חלק מהרשומות ריקות, נא לסמן אותן</div>
			</div>
			<div className="contact-scan-step-wrap">
                <RowSelector
                    src={croppedImage}
                    width={this.state.width}
                    height={this.state.height}
                    cells={cells}
                    horizontalBorders={this.state.horizontalBorders}
                    verticalBorders={this.state.verticalBorders}
                    onSelection={this.handleRowSelection.bind(this)}
                />
			</div>
		</div>;
	const postButton = <button className="post-scan-button" onClick={this.handlePost.bind(this)}>העלאת המסמך למערכת</button>;
	const failedScanPopup =
			<div className="failed-scan-popup">
			<Popup visibility={scanFailed} toggleVisibility={()=>{}}>
				<div className="failed-scan-popup-label">
					<div>זיהוי אוטומטי של הטבלה לא הצליח</div>
					<div>זיהוי אוטומטי של הטבלה לא הצליח</div>
				</div>
				<div>
					<button className="failed-scan-button" onClick={this.handlePost.bind(this)}>העלאה ללא זיהוי טבלה</button>
					<button className="failed-scan-button" onClick={this.reset.bind(this)}>בחירת קובץ אחר</button>
				</div>
			</Popup>
		</div>;
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
				{this.state.selectedImageSrc?<img className="img-preview" src={this.state.selectedImageSrc}/>:""}
				{selectedImage?postButton:""}
			</div>
		</div>
	)
}

}