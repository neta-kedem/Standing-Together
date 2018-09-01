import React from 'react';
import Router from 'next/router';
import Meta from '../lib/meta';

import config from '../config';
import server from '../services/server';
import RowSelector from './scanContacts/TableRowSelector';
import TableScanner from '../UIComponents/TableScanner/TableScanner';
import ImageUploader from '../UIComponents/ImageUploader/ImageUploader';
import ImageCropper from '../UIComponents/ImageCropper/ImageCropper';

export default class ScanContacts extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		selectedImage: false,
		croppedImage: false,
		scanUrl: null,
		horizontalBorders: [],
		verticalBorders: [],
		detectedCells: [],
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
		this.setState({data: []});
	});
}
render() {
	const selectedImage = this.state.selectedImage;
	const croppedImage = this.state.croppedImage;
	const cells = this.state.detectedCells;
	const imgUploadUI = <ImageUploader onSelect={this.handleImageSelection.bind(this)}/>;
	const imgCropperUI = <ImageCropper file={selectedImage} onCrop={this.handleImageCrop.bind(this)}/>
	const tableScannerUI = <TableScanner src={croppedImage} onDetection={this.handleTableDetection.bind(this)}/>
	const rowSelectorUI = <RowSelector src={croppedImage} width={this.state.width} height={this.state.height} cells={cells} horizontalBorders={this.state.horizontalBorders} verticalBorders={this.state.verticalBorders}/>
	const postButton = <button onClick={this.handlePost.bind(this)}>post me!</button>
	return (
		<div>
			<Meta/>
			{!selectedImage?imgUploadUI:""}
			{(selectedImage&&!croppedImage)?imgCropperUI:""}
			{!cells.length?tableScannerUI:""}
			{cells.length?rowSelectorUI:""}
			{cells.length?postButton:""}
		</div>
	)
}

}