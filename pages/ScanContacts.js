import React from 'react';
import Router from 'next/router';
import Meta from '../lib/meta';

import config from '../config';
import server from '../services/server';
import TableScanner from '../UIComponents/TableScanner/TableScanner';
import ImageUploader from '../UIComponents/ImageUploader/ImageUploader';
import ImageCropper from '../UIComponents/ImageCropper/ImageCropper';

export default class ScanContacts extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		selectedImage: false,
		croppedImage: false
	};
}
handleImageSelection(file) {
	this.setState({selectedImage: file});
}
handleImageCrop(img) {
	this.setState({croppedImage: img});
}
handleTableDetection(img, cells){
	this.setState({detectedCells: cells, normalizedImg: img});
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
	const data ={"imgUrl":this.state.imgUrl, "cells":this.state.cells};
	server.post('api/contactScan', data)
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
	const postButton = <button onClick={this.handlePost.bind(this)}>post me!</button>
	return (
		<div>
			<Meta/>
			{!selectedImage?imgUploadUI:""}
			{(selectedImage&&!croppedImage)?imgCropperUI:""}
			{tableScannerUI}
			{cells?postButton:""}
		</div>
	)
}

}