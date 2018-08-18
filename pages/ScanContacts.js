import React from 'react';
import Router from 'next/router';
import Meta from '../lib/meta';
import Stylesheet from './scanContacts/ScanContacts.css'

import server from '../services/server';
import aggregator from '../services/arrayAggregator';

//graphics
import ia from '../services/canvas/imageAdjustor';
import sd from '../services/canvas/shapeDrawer';

//optical recognition
import cornerDetector from '../services/tableDetector/cornerDetector';
import outerEdgeDetector from '../services/tableDetector/outerEdgeDetector';

export default class ScanContacts extends React.Component {
constructor(props) {
		super(props);
		this.state = {
			scanReady: false,
			topScannerPosition : 0,
			bottomScannerPosition : 1,
			cornerScanSpeed : 3,
			line1ScannerRad: -0.2,
			line2ScannerRad: -0.2,
			line3ScannerRad: -0.2+Math.PI,
			line4ScannerRad: -0.2+Math.PI,
			outerBorderScanSpeed : 5,
			outerBorderScanRadDelta : 0.02,
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
			scanImage.onload=function(){
				this.loadImageToCanvasWrap();
			};
		this.updateCanvas();
	});
	setInterval(this.updateCanvas.bind(this), 60);
	setInterval(this.detectionStep.bind(this), 60);
}
loadImageToCanvasWrap() {
	//this is the canvas we draw on
	const canvas = this.state.canvas;
	//this is a wrapping canvas for the scanned document - it stores it, and allows us to acces it's content
	const scanCanvas = this.refs.scanCanvas;
	//this is the image being scanned
	const scanImage = this.refs.scanImage;
	//initialize wrapper canvas to have the same size as the image it's wrapping
	scanCanvas.width = scanImage.width;
	scanCanvas.height = scanImage.height;
	const ctx = scanCanvas.getContext('2d');
	//initialize canvas to have a white background to prevent transparent areas messing with the detection
	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	//draw the image onto a wrapping canvas - this allows us to access the pixel data directly later on
	ia.drawImage(ctx, scanImage, 0, 0);
	//initialize drawing canvas to the size of the scanned document
	canvas.width = scanImage.width;
	canvas.height = scanImage.height;
	//storing the canvases in the state. Once done, perform minor contrast/saturation adustments.
	this.setState({width:canvas.width, height:canvas.height, scan:scanCanvas}, ()=>{this.adjustScan();});
}
adjustScan(){
	var scan = this.state.scan;
	//make the image greyscale
	ia.desaturateImage(scan.getContext('2d'));
	//increase contrast to eliminate noise and highlight edges
	ia.contrastImage(scan.getContext('2d'), 0.75);
	//store in the state
	this.setState({scan:scan}, ()=>{this.setState({scanReady:true});});
}
updateCanvas() {
	const canvas = this.state.canvas;
	if(!canvas)
		return;
	const ctx = canvas.getContext('2d');
	ia.drawImage(ctx, this.state.scan, 0, 0);
	//if still scanning for top corner, show scan progress
	if(!this.state.topCorner)
	{
		sd.drawLine(ctx, 0, this.state.topScannerPosition, this.state.width, this.state.topScannerPosition);
	}
	else
	{
		sd.fillOval(ctx, this.state.topCorner.x-2, this.state.topCorner.y-2, 5);
	}
	if(!this.state.bottomCorner)
	{
		sd.drawLine(ctx, 0, this.state.height-this.state.bottomScannerPosition, this.state.width, this.state.height-this.state.bottomScannerPosition);
	}
	else
	{
		sd.fillOval(ctx, this.state.bottomCorner.x-2, this.state.bottomCorner.y-2, 5);
	}
	if(this.state.bottomCorner&&this.state.topCorner){
		const maxLineLength = Math.sqrt(this.state.width*this.state.width + this.state.height*this.state.height);
		//outer border 1
		let x1 = this.state.topCorner.x;
		let y1 = this.state.topCorner.y;
		let x2 = x1+(maxLineLength*Math.cos(this.state.line1ScannerRad));
		let y2 = y1+(maxLineLength*Math.sin(this.state.line1ScannerRad));
		sd.drawLine(ctx, x1, y1, x2, y2);
		//outer border 2
		x1 = this.state.topCorner.x;
		y1 = this.state.topCorner.y;
		x2 = x1+(maxLineLength*Math.cos(this.state.line2ScannerRad));
		y2 = y1+(maxLineLength*Math.sin(this.state.line2ScannerRad));
		//outer border 3
		x1 = this.state.bottomCorner.x;
		y1 = this.state.bottomCorner.y;
		x2 = x1+(maxLineLength*Math.cos(this.state.line3ScannerRad));
		y2 = y1+(maxLineLength*Math.sin(this.state.line3ScannerRad));
		sd.drawLine(ctx, x1, y1, x2, y2);
		//outer border 4
		x1 = this.state.bottomCorner.x;
		y1 = this.state.bottomCorner.y;
		x2 = x1+(maxLineLength*Math.cos(this.state.line4ScannerRad));
		y2 = y1+(maxLineLength*Math.sin(this.state.line4ScannerRad));
		sd.drawLine(ctx, x1, y1, x2, y2);
	}
}
detectionStep() {
	if(!this.state.scanReady||!this.state.scan)
		return;
	if(!this.state.topCorner||!this.state.bottomCorner)
		this.detectCorners();
	if(this.state.topCorner&&this.state.bottomCorner)
	{
		this.detectOuterEdges();
	}
}
detectCorners() {
	if(!this.state.topCorner)
	{
		const topDetection = cornerDetector.detectCornerInRange(this.state.scan, this.state.topScannerPosition, 1, this.state.cornerScanSpeed, this.state.bottomCorner);
		if(topDetection)
		{
			this.setState({topCorner:{x:topDetection.x, y:topDetection.y}});
		}
		else
		{
			this.setState({"topScannerPosition":this.state.topScannerPosition+this.state.cornerScanSpeed});
		}
	}
	if(!this.state.bottomCorner)
	{
		const bottomDetection = cornerDetector.detectCornerInRange(this.state.scan, this.state.bottomScannerPosition, -1, this.state.cornerScanSpeed, this.state.topCorner);
		if(bottomDetection)
		{
			this.setState({bottomCorner:{x:bottomDetection.x, y:bottomDetection.y}});
		}
		else
		{
			this.setState({"bottomScannerPosition":this.state.bottomScannerPosition+this.state.cornerScanSpeed});
		}
	}
}
detectOuterEdges() {
	let detectedEdge = null;
	if(!this.state.line1Rad)
	{
		detectedEdge = outerEdgeDetector.detectOuterEdgeFromCorner(
			this.state.scan, this.state.topCorner.x, this.state.topCorner.y, this.state.line1ScannerRad, this.state.outerBorderScanRadDelta, this.state.outerBorderScanSpeed
		)
		if(detectedEdge!=null)
			this.setState({line1Rad: detectedEdge.rad, topCorner: {"x":detectedEdge.x, "y":detectedEdge.y}});
		else
			this.setState({line1ScannerRad: this.state.line1ScannerRad+(this.state.outerBorderScanRadDelta*this.state.outerBorderScanSpeed)});
	}
	if(!this.state.line2Rad)
	{
		detectedEdge = outerEdgeDetector.detectOuterEdgeFromCorner(
			this.state.scan, this.state.topCorner.x, this.state.topCorner.y, this.state.line2ScannerRad, this.state.outerBorderScanRadDelta, this.state.outerBorderScanSpeed
		)
		if(detectedEdge!=null)
			this.setState({line2Rad: detectedEdge.rad, topCorner: {"x":detectedEdge.x, "y":detectedEdge.y}});
		else
			this.setState({line2ScannerRad: this.state.line2ScannerRad+(this.state.outerBorderScanRadDelta*this.state.outerBorderScanSpeed)});
	}
	if(!this.state.line3Rad)
	{
		detectedEdge = outerEdgeDetector.detectOuterEdgeFromCorner(
			this.state.scan, this.state.bottomCorner.x, this.state.bottomCorner.y, this.state.line3ScannerRad, this.state.outerBorderScanRadDelta, this.state.outerBorderScanSpeed
		)
		if(detectedEdge!=null)
			this.setState({line3Rad: detectedEdge.rad, bottomCorner: {"x":detectedEdge.x, "y":detectedEdge.y}});
		else
			this.setState({line3ScannerRad: this.state.line3ScannerRad+(this.state.outerBorderScanRadDelta*this.state.outerBorderScanSpeed)});
	}
	if(!this.state.line4Rad)
	{
		detectedEdge = outerEdgeDetector.detectOuterEdgeFromCorner(
			this.state.scan, this.state.bottomCorner.x, this.state.bottomCorner.y, this.state.line4ScannerRad, this.state.outerBorderScanRadDelta, this.state.outerBorderScanSpeed
		)
		if(detectedEdge!=null)
			this.setState({line4Rad: detectedEdge.rad, bottomCorner: {"x":detectedEdge.x, "y":detectedEdge.y}});
		else
			this.setState({line4ScannerRad: this.state.line4ScannerRad+(this.state.outerBorderScanRadDelta*this.state.outerBorderScanSpeed)});
	}
}
render() {
	return (
		<div dir="rtl">
			<Meta/>
			<style jsx global>{Stylesheet}</style>
			<canvas ref="canvas" width={300} height={300} className="scanCanvas"/>
			<canvas ref="scanCanvas" className="hidden"/>
			<img ref="scanImage" src="../static/table_mid_small.png" className="hidden"/>
		</div>
	)
}

}