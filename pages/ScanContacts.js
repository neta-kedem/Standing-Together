import React from 'react';
import Meta from '../lib/meta';

import config from '../services/config';
import server from '../services/server';
import style from './scanContacts/ScanContacts.css';
import ImageUploader from '../UIComponents/ImageUploader/ImageUploader';
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';
import ia from "../services/canvas/imageAdjustor";

export default class ScanContacts extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		selectedImage: false,
		selectedImageSrc: false,
		scanUrl: null,
		scanWidth: 1000, //this is a constant - the uploaded scan will be this many pixels wide
		width: 1000, //this stays 1000 throughout
		height: 1000, //this changes according to the aspect ratio of the uploaded picture
	};
	this.canvasRef = React.createRef();
	this.imgRef = React.createRef();
}
loadImageToCanvasWrap() {
	//this is the canvas we draw on
	const canvas = this.canvasRef.current;
	//this is the image being scanned
	const scanImage = this.imgRef.current;
	//initialize wrapper canvas to have the same size as the image it's wrapping
	canvas.width = this.state.scanWidth;
	canvas.height = Math.floor(scanImage.height/scanImage.width*this.state.scanWidth);
	const ctx = canvas.getContext('2d');
	//initialize canvas to have a white background to prevent transparent areas messing with the detection
	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//draw the image onto a wrapping canvas - this allows us to access the pixel data directly later on
	ia.drawImage(ctx, scanImage, 0, 0, canvas.width, canvas.height);
	//storing the canvases in the state. Once done, perform minor contrast/saturation adjustments.
	this.setState({width:canvas.width, height:canvas.height});
}
rotateScan(dir){
	const canvas = this.canvasRef.current;
	const ctx = canvas.getContext('2d');
	ia.rotateImg(ctx, dir);
}
handleImageSelection(file) {
	const reader = new FileReader();
	reader.onload = ()=>{
		this.setState({selectedImageSrc: reader.result}, ()=>{
			const scanImage = this.imgRef.current;
			scanImage.src = this.state.selectedImageSrc;
			if(scanImage.complete)
				this.loadImageToCanvasWrap();
			else
				scanImage.onload = ()=>{
					this.loadImageToCanvasWrap();
				};
		});
	};
	reader.readAsDataURL(file);
	this.setState({selectedImage: file});
}
handlePost(){
	this.canvasRef.current.toBlob(file => {
		const formWrap = new FormData();
		formWrap.append("scan", file);
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
		}, 'image/jpeg');
}
publishScan(imgUrl){
	const data ={"scanUrl":imgUrl};
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
	const imgUploadUI = <div className="contact-scan-uploader">
			<ImageUploader onSelect={this.handleImageSelection.bind(this)} labelText="⇪ העלאת סריקת דף קשר ⇪"/>
		</div>;
	const postButton = <button className="post-scan-button" onClick={this.handlePost.bind(this)}>העלאת המסמך למערכת</button>;
	const scanPreview = <div>
		<div className={"rotation-controls"}>
			<button onClick={()=>{this.rotateScan(true)}}>↻</button>
			<button onClick={()=>{this.rotateScan(false)}}>↺</button>
		</div>
		<canvas ref={this.canvasRef} className="img-preview"/>
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
				{this.state.selectedImageSrc ? scanPreview : ""}
				<img src="" ref={this.imgRef} className="hidden"/>
				{selectedImage?postButton:""}
			</div>
		</div>
	)
}

}