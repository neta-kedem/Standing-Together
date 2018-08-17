import React from 'react';
import Router from 'next/router';
import Meta from '../lib/meta';
import Stylesheet from './scanContacts/ScanContacts.css'

import server from '../services/server';
import aggregator from '../services/arrayAggregator';

export default class ScanContacts extends React.Component {
constructor(props) {
		super(props);
		this.state = {
			scanReady: false,
			topScannerPosition : 0,
			bottomScannerPosition : 1,
			scanSpeed : 3,
		};
	}

componentDidMount() {
	const canvas = this.refs.canvas;
	const ctx = canvas.getContext('2d');
	this.setState({canvas: canvas},()=>{
		const scanImage = this.refs.scanImage;
		if(scanImage.complete)
			this.loadImageToCanvasWrap();
		else
			scanImageonload=function(){
				this.loadImageToCanvasWrap();
			};
		this.updateCanvas();
	});
	setInterval(this.updateCanvas.bind(this), 60);
	setInterval(this.detectionStep.bind(this), 60);
}
loadImageToCanvasWrap() {
	const canvas = this.state.canvas;
	const scanCanvas = this.refs.scanCanvas;
	const scanImage = this.refs.scanImage;
	scanCanvas.width = scanImage.width;
	scanCanvas.height = scanImage.height;
	this.drawImage(scanCanvas.getContext('2d'), scanImage, 0, 0);
	canvas.width = scanImage.width;
	canvas.height = scanImage.height;
	this.setState({width:canvas.width, height:canvas.height, scan:scanCanvas}, ()=>{this.adjustScan();});
}
adjustScan(){
	var scan = this.state.scan;
	this.desaturateImage(scan.getContext('2d'));
	this.contrastImage(scan.getContext('2d'), 0.75);
	this.setState({scan:scan}, ()=>{this.setState({scanReady:true});});
}
updateCanvas() {
	const canvas = this.state.canvas;
	if(!canvas)
		return;
	const ctx = canvas.getContext('2d');
	this.drawImage(ctx, this.state.scan, 0, 0);
	//if still scanning for top corner, show scan progress
	if(!this.state.topCorner)
	{
		this.drawLine(ctx, 0, this.state.topScannerPosition, this.state.width, this.state.topScannerPosition);
	}
	else
	{
	this.fillOval(ctx, this.state.topCorner.x-2, this.state.topCorner.y-2, 5);
	}
	if(!this.state.bottomCorner)
	{
		this.drawLine(ctx, 0, this.state.height-this.state.bottomScannerPosition, this.state.width, this.state.height-this.state.bottomScannerPosition);
	}
	else
	{
	this.fillOval(ctx, this.state.bottomCorner.x-2, this.state.bottomCorner.y-2, 5);
	}
}
drawImage(context, img, x, y){
	if(img)
		context.drawImage(img, x, y);
}
drawLine(ctx, x1, y1, x2, y2)
{
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
}
drawOval(ctx, x, y, radius)
{
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.stroke();
}
fillOval(ctx, x, y, radius)
{
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
}
desaturateImage(img){
	let imageData = img.getImageData(0, 0, img.canvas.width, img.canvas.height);
	let data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
		var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
		// red
		data[i] = brightness;
		// green
		data[i + 1] = brightness;
		// blue
		data[i + 2] = brightness;
	}
	// overwrite original image
	img.putImageData(imageData, 0 ,0);
}
//contrast between -1 and 1
contrastImage(img, contrast){
	let imageData = img.getImageData(0, 0, img.canvas.width, img.canvas.height);
	let data = imageData.data;
    contrast = contrast + 1;  //convert to decimal & shift range: [0..2]
    const intercept = 128 * (1 - contrast);
    for(var i=0;i<data.length;i+=4){   //r,g,b,a
        data[i] = data[i]*contrast + intercept;
        data[i+1] = data[i+1]*contrast + intercept;
        data[i+2] = data[i+2]*contrast + intercept;
    }
    // overwrite original image
	img.putImageData(imageData, 0 ,0);
}
detectionStep() {
	if(!this.state.scanReady||!this.state.scan)
		return;
	if(!this.state.topCorner)
		this.detectTopCorner();
	if(!this.state.bottomCorner)
		this.detectBottomCorner();
}
detectTopCorner() {
	const scan = this.state.scan.getContext('2d');
	for(var i=0; i<this.state.scanSpeed; i++)
	{
		var row = scan.getImageData(0, this.state.topScannerPosition, this.state.width, 1);
		const cornerXSearch = this.scanRowForCorner(row, 1);
		if (cornerXSearch!=null)
		{
			this.setState({topCorner:{x:cornerXSearch, y:this.state.topScannerPosition}});
			return;
		}
		this.setState({"topScannerPosition":this.state.topScannerPosition+1});
	}
}
detectBottomCorner() {
	const scan = this.state.scan.getContext('2d');
	for(var i=0; i<this.state.scanSpeed; i++)
	{
		var row = scan.getImageData(0, this.state.scan.height-this.state.bottomScannerPosition, this.state.width, 1);
		const cornerXSearch = this.scanRowForCorner(row, -1);
		if (cornerXSearch!=null)
		{
			this.setState({bottomCorner:{x:cornerXSearch, y:(this.state.scan.height-this.state.bottomScannerPosition)}});
			return;
		}
		this.setState({"bottomScannerPosition":this.state.bottomScannerPosition+1});
	}
}
scanRowForCorner(row, dir) {
	const cornerWidthThreshold = 2;
	const cornerBrightnessThreshold = 200;
	if(dir==1)
	{
		for(var j=0; j<row.data.length-(cornerWidthThreshold*4); j+=4)
		{
			if(aggregator.avg(row.data.slice(j, j+(cornerWidthThreshold*4)))<cornerBrightnessThreshold)
			{
				return Math.floor(j/4);
			}
		}
	}
	if(dir==-1)
	{
		for(var j=row.data.length-(cornerWidthThreshold*4)-1; j>=0; j-=4)
		{
			if(aggregator.avg(row.data.slice(j, j+(cornerWidthThreshold*4)))<cornerBrightnessThreshold)
			{
				return Math.floor(j/4);
			}
		}
	}
	return null;
}
render() {
	return (
		<div dir="rtl">
			<Meta/>
			<style jsx global>{Stylesheet}</style>
			<canvas ref="canvas" width={300} height={300} className="scanCanvas"/>
			<canvas ref="scanCanvas" className="hidden"/>
			<img ref="scanImage" src="../static/table_mid.png" className="hidden"/>
		</div>
	)
}

}