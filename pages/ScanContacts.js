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
	ia.drawImage(scanCanvas.getContext('2d'), scanImage, 0, 0);
	canvas.width = scanImage.width;
	canvas.height = scanImage.height;
	this.setState({width:canvas.width, height:canvas.height, scan:scanCanvas}, ()=>{this.adjustScan();});
}
adjustScan(){
	var scan = this.state.scan;
	ia.desaturateImage(scan.getContext('2d'));
	ia.contrastImage(scan.getContext('2d'), 0.75);
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
}
detectionStep() {
	if(!this.state.scanReady||!this.state.scan)
		return;
	if(!this.state.topCorner||!this.state.bottomCorner)
		this.detectCorners();
}
detectCorners() {
	if(!this.state.topCorner)
	{
		const topDetection = cornerDetector.detectTopCorner(this.state.scan, this.state.scanSpeed, this.state.topScannerPosition);
		if(topDetection)
		{
			this.setState({topCorner:{x:topDetection.x, y:topDetection.y}});
		}
		else
		{
			this.setState({"topScannerPosition":this.state.topScannerPosition+this.state.scanSpeed});
		}
	}
	if(!this.state.bottomCorner)
	{
		const bottomDetection = cornerDetector.detectBottomCorner(this.state.scan, this.state.scanSpeed, this.state.bottomScannerPosition);
		if(bottomDetection)
		{
			this.setState({bottomCorner:{x:bottomDetection.x, y:bottomDetection.y}});
		}
		else
		{
			this.setState({"bottomScannerPosition":this.state.bottomScannerPosition+this.state.scanSpeed});
		}
	}
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