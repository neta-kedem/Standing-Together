import React from 'react';
import Router from 'next/router';
import Meta from '../lib/meta';

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
render() {
	const selectedImage = this.state.selectedImage;
	const croppedImage = this.state.croppedImage;
	const imgUploadUI = <ImageUploader onSelect={this.handleImageSelection.bind(this)}/>;
	const imgCropperUI = <ImageCropper file={selectedImage} onCrop={this.handleImageCrop.bind(this)}/>
	const tableScannerUI = <TableScanner src={croppedImage}/>
	return (
		<div>
			<Meta/>
			{imgUploadUI}
			{(selectedImage&&!croppedImage)?imgCropperUI:""}
			{tableScannerUI}
		</div>
	)
}

}