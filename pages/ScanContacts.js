import React from 'react';
import Router from 'next/router';
import Meta from '../lib/meta';
import Stylesheet from './scanContacts/ScanContacts.css'

import server from '../services/server';
import aggregator from '../services/arrayAggregator';

//graphics
import ia from '../services/canvas/imageAdjustor';
import ScannerDrawer from './scanContacts/ScannerDrawer'

//optical recognition
import cornerDetector from '../services/tableDetector/cornerDetector';
import outerEdgeDetector from '../services/tableDetector/outerEdgeDetector';
import borderDetector from '../services/tableDetector/borderDetector';

export default class ScanContacts extends React.Component {
constructor(props) {
		super(props);
		this.state = {
			scanReady: false,
			scanWidth: 1000,
			topScannerPosition : 0,
			cornerScanSpeed : 3,
			line1ScannerRad: -0.5+(Math.PI/2),
			line2ScannerRad: -0.5+(Math.PI),
			outerBorderScanSpeed : 10,
			outerBorderScanRadDelta : 0.005,
			bordersScannerPosition: 0,
			bordersScannerSpeed: 10,
			verticalBorders: [],
			horizontalBorders: [],
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
			}.bind(this);
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
	scanCanvas.width = 1000;
	scanCanvas.height = Math.floor(scanImage.height/scanImage.width*1000);
	const ctx = scanCanvas.getContext('2d');
	//initialize canvas to have a white background to prevent transparent areas messing with the detection
	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(0, 0, scanCanvas.width, scanCanvas.height);
	//draw the image onto a wrapping canvas - this allows us to access the pixel data directly later on
	ia.drawImage(ctx, scanImage, 0, 0, scanCanvas.width, scanCanvas.height);
	//initialize drawing canvas to the size of the scanned document
	canvas.width = scanCanvas.width;
	canvas.height = scanCanvas.height;
	//storing the canvases in the state. Once done, perform minor contrast/saturation adustments.
	this.setState({width:canvas.width, height:canvas.height, scan:scanCanvas}, ()=>{this.adjustScan();});
}
adjustScan(){
	var scan = this.state.scan;
	//make the image greyscale
	ia.desaturateImage(scan.getContext('2d'));
	//increase contrast to eliminate noise and highlight edges
	ia.contrastImage(scan.getContext('2d'), 0.8);
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
		ScannerDrawer.drawCornerScanner(ctx, this.state.topScannerPosition);
	}
	if(this.state.topCorner)
	{
		ScannerDrawer.drawDetectedCorner(ctx, this.state.topCorner.x, this.state.topCorner.y);
		//outer border 1 scanner
		if(!this.state.line1Rad){
			ScannerDrawer.drawOuterBorderScanner(ctx, this.state.topCorner.x, this.state.topCorner.y, this.state.line1ScannerRad);
		}
		//outer border 2 scanner
		if(!this.state.line2Rad){
			ScannerDrawer.drawOuterBorderScanner(ctx, this.state.topCorner.x, this.state.topCorner.y, this.state.line2ScannerRad);
		}
		//vertical outer border
		if(this.state.verticalEdgeRad){
			ScannerDrawer.drawOuterBorder(ctx, this.state.topCorner.x, this.state.topCorner.y, this.state.verticalEdgeRad);
		}
		//horizontal outer border
		if(this.state.horizontalEdgeRad){
			ScannerDrawer.drawOuterBorder(ctx, this.state.topCorner.x, this.state.topCorner.y, this.state.horizontalEdgeRad);
		}
	}
	if(this.state.horizontalEdgeRad&&this.state.verticalEdgeRad)
	{
		const bordersScannerPosition =  this.state.bordersScannerPosition;
		const scannerOriginX = this.state.topCorner.x;
		const scannerOriginY = this.state.topCorner.y;
		const horizontalEdgeRad = this.state.horizontalEdgeRad;
		const verticalEdgeRad = this.state.verticalEdgeRad;
		const horizontalScannerPositionX = scannerOriginX+bordersScannerPosition*Math.cos(verticalEdgeRad);
		const horizontalScannerPositionY = scannerOriginY+bordersScannerPosition*Math.sin(verticalEdgeRad);
		const verticalScannerPositionX = scannerOriginX+bordersScannerPosition*Math.cos(horizontalEdgeRad);
		const verticalScannerPositionY = scannerOriginY+bordersScannerPosition*Math.sin(horizontalEdgeRad);
		ScannerDrawer.drawBorderScanner(ctx, horizontalScannerPositionX, horizontalScannerPositionY, this.state.horizontalEdgeRad);
		ScannerDrawer.drawBorderScanner(ctx, verticalScannerPositionX, verticalScannerPositionY, this.state.verticalEdgeRad);
		const horizontalBorders = this.state.horizontalBorders.slice();
		const verticalBorders = this.state.verticalBorders.slice(); 
		for(var i=0; i<horizontalBorders.length; i++)
		{
			ScannerDrawer.drawBorder(ctx, horizontalBorders[i].x, horizontalBorders[i].y, this.state.horizontalEdgeRad);
		}
		for(var i=0; i<verticalBorders.length; i++)
		{
			ScannerDrawer.drawBorder(ctx, verticalBorders[i].x, verticalBorders[i].y, this.state.verticalEdgeRad);
		}
	}
}

detectionStep() {
	if(!this.state.scanReady||!this.state.scan)
		return;
	if(!this.state.topCorner)
		this.detectCorners();
	if(this.state.topCorner&&(!this.state.horizontalEdgeRad||!this.state.verticalEdgeRad))
	{
		this.detectOuterEdges();
	}
	if(this.state.horizontalEdgeRad&&this.state.verticalEdgeRad&&(!this.state.allHorizontalBordersFound||!this.state.allVerticalBordersFound))
	{
		this.detectBorders();
	}
}
detectCorners() {
	if(!this.state.topCorner)
	{
		const topDetection = cornerDetector.detectCornerInRange(this.state.scan, this.state.topScannerPosition, 1, this.state.cornerScanSpeed);
		if(topDetection)
		{
			this.setState({topCorner:{x:topDetection.x, y:topDetection.y}});
			if(topDetection.x<this.state.width/2)
				this.setState({line1ScannerRad:this.state.line1ScannerRad+Math.PI/2*3, line2ScannerRad:this.state.line2ScannerRad+Math.PI/2*3,});
		}
		else
		{
			this.setState({"topScannerPosition":this.state.topScannerPosition+this.state.cornerScanSpeed});
		}
	}
}
detectOuterEdges() {
	let detectedEdge = null;
	let isHorizontal = false;
	let alreadyDetected = false;
	if(!this.state.line1Rad)
	{
		detectedEdge = outerEdgeDetector.detectOuterEdgeFromCorner(
			this.state.scan, this.state.topCorner.x, this.state.topCorner.y, this.state.line1ScannerRad, this.state.outerBorderScanRadDelta, this.state.outerBorderScanSpeed
		)
		if(detectedEdge!=null)
		{
			isHorizontal = Math.abs(Math.cos(detectedEdge.rad))>Math.abs(Math.sin(detectedEdge.rad));
			if(isHorizontal)
			{
				if(!this.state.horizontalEdgeRad)
				{
					this.setState({horizontalEdgeRad: detectedEdge.rad, line1Rad: detectedEdge.rad});
					alreadyDetected = false;
				}
				else
					alreadyDetected=true;
			}
			if(!isHorizontal)
			{
				if(!this.state.verticalEdgeRad)
				{
					this.setState({verticalEdgeRad: detectedEdge.rad, line1Rad: detectedEdge.rad});
					alreadyDetected=false;
				}
				else
					alreadyDetected=true;
			}
		}
		if(detectedEdge==null||alreadyDetected)
			this.setState({line1ScannerRad: this.state.line1ScannerRad+(this.state.outerBorderScanRadDelta*this.state.outerBorderScanSpeed)});
	}
	if(!this.state.line2Rad)
	{
		detectedEdge = outerEdgeDetector.detectOuterEdgeFromCorner(
			this.state.scan, this.state.topCorner.x, this.state.topCorner.y, this.state.line2ScannerRad, this.state.outerBorderScanRadDelta, this.state.outerBorderScanSpeed
		)
		if(detectedEdge!=null)
		{
			isHorizontal = Math.abs(Math.cos(detectedEdge.rad))>Math.abs(Math.sin(detectedEdge.rad));
			if(isHorizontal)
			{
				if(!this.state.horizontalEdgeRad)
				{
					this.setState({horizontalEdgeRad: detectedEdge.rad, line2Rad: detectedEdge.rad});
					alreadyDetected = false;
				}
				else
					alreadyDetected=true;
			}
			if(!isHorizontal)
			{
				if(!this.state.verticalEdgeRad)
				{
					this.setState({verticalEdgeRad: detectedEdge.rad, line2Rad: detectedEdge.rad});
					alreadyDetected=false;
				}
				else
					alreadyDetected=true;
			}
		}
		if(detectedEdge==null||alreadyDetected)
			this.setState({line2ScannerRad: this.state.line2ScannerRad+(this.state.outerBorderScanRadDelta*this.state.outerBorderScanSpeed)});
	}
}

detectBorders() {
	const horizontalBorders = this.state.horizontalBorders.slice();
	const verticalBorders = this.state.verticalBorders.slice();
	const scan = this.state.scan;
	const x = this.state.topCorner.x;
	const y = this.state.topCorner.y;
	const horizontalEdgeRad = this.state.horizontalEdgeRad;
	const verticalEdgeRad = this.state.verticalEdgeRad;
	const bordersScannerPosition = this.state.bordersScannerPosition;
	//check for borders parallel to the horizontal edge
	const border1Origin = borderDetector.detectBorder(
		scan, x, y, horizontalEdgeRad, verticalEdgeRad, bordersScannerPosition, this.state.bordersScannerSpeed
	);
	if(border1Origin!=null)
	{
		horizontalBorders.push(border1Origin);
		this.setState({horizontalBorders:horizontalBorders});
	}
	//check for borders parallel to the vertical edge
	const border2Origin = borderDetector.detectBorder(
		scan, x, y, verticalEdgeRad, horizontalEdgeRad, bordersScannerPosition, this.state.bordersScannerSpeed
	);
	if(border2Origin!=null)
	{
		verticalBorders.push(border2Origin);
		this.setState({verticalBorders:verticalBorders});
	}
	this.setState({bordersScannerPosition: bordersScannerPosition+this.state.bordersScannerSpeed});
	this.checkBorderScanComplete();
}
checkBorderScanComplete() {
	const xOrigin = this.state.topCorner.x;
	const yOrigin = this.state.topCorner.y;
	const horizontalEdgeRad = this.state.horizontalEdgeRad;
	const verticalEdgeRad = this.state.verticalEdgeRad;
	const bordersScannerPosition = this.state.bordersScannerPosition;
	//check if horizontal scan is complete
	let moveAlongY = Math.sin(verticalEdgeRad);
	let sin = Math.sin(horizontalEdgeRad);
	let y = Math.floor(yOrigin+moveAlongY*bordersScannerPosition);
	if(y>this.state.height||y<=0)
		this.setState({allHorizontalBordersFound:true});
	//check if vertical scan is complete
	let moveAlongX = Math.cos(horizontalEdgeRad);
	let cos = Math.cos(verticalEdgeRad);
	let x = Math.floor(xOrigin+moveAlongX*bordersScannerPosition);
	if(x>this.state.width||x<=0)
		this.setState({allVerticalBordersFound:true});
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