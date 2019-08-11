import React from 'react';
import Stylesheet from './TableScanner.css'

import aggregator from '../../services/arrayAggregator';

//graphics
import sd from '../../services/canvas/shapeDrawer';
import ia from '../../services/canvas/imageAdjustor';
import ScannerDrawer from './ScannerDrawer'

//optical recognition
import cornerDetector from '../../services/tableDetector/cornerDetector';
import outerEdgeDetector from '../../services/tableDetector/outerEdgeDetector';
import borderDetector from '../../services/tableDetector/borderDetector';
import duplicateBorderDetector from '../../services/tableDetector/duplicateBorderDetector';
import cellsDetector from '../../services/tableDetector/cellsDetector';

export default class TableScanner extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		src: props.src,
		onDetection: props.onDetection,
		onFail: props.onFail,
		scanReady: false,
		scanWidth: 1000,
		topScannerPosition : 0,
		cornerScanSpeed : 5,
		line1ScannerRad: -0.5+(Math.PI/2),
		line2ScannerRad: -0.5+(Math.PI),
		outerBorderScanSpeed : 10,
		outerBorderScanRadDelta : 0.004,
		bordersScannerPosition: 0,
		bordersScannerSpeed: 10,
		verticalBorders: [],
		horizontalBorders: [],
		cells: []
	};
}

componentDidMount() {
	if(this.state.src)
		this.initializeScanner();
}
	
componentWillReceiveProps(nextProps) {
  // You don't have to do this check first, but it can help prevent an unneeded render
  if (nextProps.src && !this.state.src) {
	this.setState({src: nextProps.src});
	this.initializeScanner();
  }
}
initializeScanner() {
	const canvas = this.refs.canvas;
	const ctx = canvas.getContext('2d');
	this.setState({canvas: canvas},()=>{
		const scanImage = this.refs.scanImage;
		scanImage.src = this.state.src;
		if(scanImage.complete)
			this.loadImageToCanvasWrap();
		else
			scanImage.onload=function(){
				this.loadImageToCanvasWrap();
			}.bind(this);
		this.updateCanvas();
	});
	const drawInterval = setInterval(this.updateCanvas.bind(this), 60);
	const detectionInterval = setInterval(this.detectionStep.bind(this), 60);
	this.setState({drawInterval:drawInterval, detectionInterval:detectionInterval});
}
loadImageToCanvasWrap() {
	//this is the canvas we draw on
	const canvas = this.state.canvas;
	//this is a wrapping canvas for the scanned document - it stores it as is, before any adjustments
	const originalScanCanvas = this.refs.originalScanCanvas;
	//this is the image being scanned
	const scanImage = this.refs.scanImage;
	//initialize wrapper canvas to have the same size as the image it's wrapping
	originalScanCanvas.width = this.state.scanWidth;
	originalScanCanvas.height = Math.floor(scanImage.height/scanImage.width*this.state.scanWidth);
	const ctx = originalScanCanvas.getContext('2d');
	//initialize canvas to have a white background to prevent transparent areas messing with the detection
	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(0, 0, originalScanCanvas.width, originalScanCanvas.height);
	//draw the image onto a wrapping canvas - this allows us to access the pixel data directly later on
	ia.drawImage(ctx, scanImage, 0, 0, originalScanCanvas.width, originalScanCanvas.height);
	//initialize drawing canvas to the size of the scanned document
	canvas.width = originalScanCanvas.width;
	canvas.height = originalScanCanvas.height;
	//storing the canvases in the state. Once done, perform minor contrast/saturation adustments.
	this.setState({width:canvas.width, height:canvas.height, originalScan:originalScanCanvas}, ()=>{this.adjustScan();});
}
/**
clones the canvas wrap for the original scanned image, and performs some adjustments on it.
the result of this adjustments will be used for the detection of the table, while the original image
will be displayed.
*/
adjustScan(){
	//this function
	const originalScan = this.state.originalScan;
	//this is a wrapping canvas for the scanned document - it stores it (after adujestments), and allows us to acces it's content
	const scanCanvas = this.refs.scanCanvas;
	//initialize wrapper canvas to have the same size as the image it's wrapping
	scanCanvas.width = originalScan.width;
	scanCanvas.height = originalScan.height;
	const ctx = scanCanvas.getContext('2d');
	//initialize canvas to have a white background to prevent transparent areas messing with the detection
	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(0, 0, scanCanvas.width, scanCanvas.height);
	//draw the image onto a wrapping canvas - this allows us to access the pixel data directly later on
	ia.drawImage(ctx, originalScan, 0, 0);
	//make the image greyscale
	ia.desaturateImage(ctx);
	//increase contrast to eliminate noise and highlight edges
	ia.contrastImage(ctx, 2.5, 180);
	ia.threshold(ctx, 0.9, 3, 0.25);
	//store in the state
	this.setState({scan:scanCanvas}, ()=>{this.setState({scanReady:true});});
}
updateCanvas() {
	const canvas = this.state.canvas;
	if(!canvas)
		return;
	const ctx = canvas.getContext('2d');
	ia.drawImage(ctx, this.state.originalScan, 0, 0);
	//dont draw any overlaying grpahics if the cells were identified - they will be drawn using DOM elements
	if(this.state.cells.length>0)
		return;
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
		const horizontalBorders = this.state.horizontalBorders.slice();
		const verticalBorders = this.state.verticalBorders.slice(); 
		const horizontalEdgeRad = horizontalBorders[horizontalBorders.length-1].rad;
		const verticalEdgeRad = verticalBorders[verticalBorders.length-1].rad;
		const horizontalScannerPositionX = scannerOriginX+bordersScannerPosition*Math.cos(verticalEdgeRad);
		const horizontalScannerPositionY = scannerOriginY+bordersScannerPosition*Math.sin(verticalEdgeRad);
		const verticalScannerPositionX = scannerOriginX+bordersScannerPosition*Math.cos(horizontalEdgeRad);
		const verticalScannerPositionY = scannerOriginY+bordersScannerPosition*Math.sin(horizontalEdgeRad);
		ScannerDrawer.drawBorderScanner(ctx, horizontalScannerPositionX, horizontalScannerPositionY, horizontalEdgeRad);
		ScannerDrawer.drawBorderScanner(ctx, verticalScannerPositionX, verticalScannerPositionY, verticalEdgeRad);
		
		for(var i=0; i<horizontalBorders.length; i++)
		{
			ScannerDrawer.drawBorder(ctx, horizontalBorders[i].x, horizontalBorders[i].y, horizontalBorders[i].rad);
		}
		for(var i=0; i<verticalBorders.length; i++)
		{
			ScannerDrawer.drawBorder(ctx, verticalBorders[i].x, verticalBorders[i].y, verticalBorders[i].rad);
		}
	}
}
onFail = function (cause){
	clearInterval(this.state.detectionInterval);
	clearInterval(this.state.drawInterval);
	this.state.originalScan.toBlob(file => {
		file.name = "test";
		this.state.onFail(file, this.state.canvas.width, this.state.canvas.height, cause);
	}, 'image/jpeg');
}
detectionStep() {
	//if the image hasn't loaded up yet, don't do anything
	if(!this.state.scanReady||!this.state.scan)
		return;
	//once the image has loaded, and as long as a top corner wasn't detected, try detecting the top corner.
	if(!this.state.topCorner)
	{
		this.detectCorners();
		//if after scanning the entire image no corner was found, the scan has failed
		if(this.state.topScannerPosition>this.state.height)
			this.onFail("no corner");
	}
	//once a top corner has been detected, and as long as either of the outer edges originating from the corner hasn't been detected yet, try to detect them.
	if(this.state.topCorner&&(!this.state.horizontalEdgeRad||!this.state.verticalEdgeRad))
	{
		this.detectOuterEdges();
		//if after a 2PI rotation no borders were found, the scan has failed
		if(this.state.line1ScannerRad>Math.PI*4&&this.state.line2ScannerRad>Math.PI*4)
			this.onFail("no outer borders");
	}
	//once both outer borders have been detected, and as long as either  inner border scanner is in the bounds of the image, scan for additional innner borders.
	if(this.state.horizontalEdgeRad&&this.state.verticalEdgeRad&&(!this.state.allHorizontalBordersFound||!this.state.allVerticalBordersFound))
	{
		if(this.state.horizontalBorders.length==0&&this.state.verticalBorders.length==0)
		{
			//if both outer edges were detected, but no borders are defined, initialize the borders arrays to contain the table origin
			const firstHorizontalBorder = [{x:this.state.topCorner.x, y:this.state.topCorner.y, rad:this.state.horizontalEdgeRad}];
			const firstVerticalBorder = [{x:this.state.topCorner.x, y:this.state.topCorner.y, rad:this.state.verticalEdgeRad}];
			//add the first two borders to the state-stored array
			this.setState({horizontalBorders:firstHorizontalBorder, verticalBorders:firstVerticalBorder});
		}
		this.detectBorders();
	}
	//once all borders have been detected, if the cells array wasn't calculated yet, calculate the cells array
	if(this.state.allHorizontalBordersFound&&this.state.allVerticalBordersFound&&this.state.cells.length==0){
		//if no additional borders (other than the outer ones) where detected, the scan has failed
		if(this.state.verticalBorders.length<1||this.state.horizontalBorders.length<2)
			this.onFail("no inner borders");
		const cells = cellsDetector.detectCells(
			this.state.verticalBorders, this.state.horizontalBorders
		);
		this.setState({"cells":cells});
		//before posting to the server, iterate over the cells and sort them by rows
		const colCount = this.state.verticalBorders.length-1;
		const rowCount = this.state.horizontalBorders.length-1;
		let structuredCells = [];
		for(let i=0; i<colCount; i++)
		{
			for(let j=0; j<rowCount; j++)
			{
				if(!structuredCells[j]||!structuredCells[j].length)
					structuredCells[j]=[];
				structuredCells[j][i]=cells[i*rowCount+j];
			}
		}
		this.state.originalScan.toBlob(file => {
			file.name = "test";
			this.state.onDetection(file, this.state.canvas.width, this.state.canvas.height, structuredCells, this.state.horizontalBorders, this.state.verticalBorders);
		}, 'image/jpeg');
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
	const lastHorizontalBorderRad = horizontalBorders[horizontalBorders.length-1].rad;
	const lastVerticalBorderRad = verticalBorders[verticalBorders.length-1].rad;
	const scan = this.state.scan;
	const x = this.state.topCorner.x;
	const y = this.state.topCorner.y;
	const horizontalEdgeRad = this.state.horizontalEdgeRad;
	const verticalEdgeRad = this.state.verticalEdgeRad;
	const bordersScannerPosition = this.state.bordersScannerPosition;
	//check for borders parallel to the horizontal edge
	const border1Origin = borderDetector.detectBorder(
		scan, x, y, lastHorizontalBorderRad, verticalEdgeRad, bordersScannerPosition, this.state.bordersScannerSpeed
	);
	if(border1Origin!=null&&duplicateBorderDetector.isBorderNonDuplicate(horizontalBorders, border1Origin, true))
	{
		horizontalBorders.push(border1Origin);
		this.setState({horizontalBorders:horizontalBorders});
	}
	//check for borders parallel to the vertical edge
	const border2Origin = borderDetector.detectBorder(
		scan, x, y, lastVerticalBorderRad, horizontalEdgeRad, bordersScannerPosition, this.state.bordersScannerSpeed
	);
	if(border2Origin!=null&&duplicateBorderDetector.isBorderNonDuplicate(verticalBorders, border2Origin, false))
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
		<div>
			<style jsx global>{Stylesheet}</style>
			<div className="display-wrap">
				<canvas ref="canvas" width={300} height={300} className="scan-canvas"/>
			</div>
			<canvas ref="scanCanvas" className="hidden"/>
			<canvas ref="originalScanCanvas" className="hidden"/>
			<img ref="scanImage" className="hidden"/>
		</div>
	)
}

}