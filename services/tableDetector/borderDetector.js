import aggregator from '../arrayAggregator';
function detectBorder(img, xEdge, yEdge, rad, moveAlong, scanPos, speed) {
	const moveAlongX = Math.cos(moveAlong);
	const moveAlongY = Math.sin(moveAlong);
	let sin = Math.sin(rad);
	let cos = Math.cos(rad);
	for(var i=0; i<speed; i++)
	{
		let x = Math.floor(xEdge+moveAlongX*(scanPos+i));
		let y = Math.floor(yEdge+moveAlongY*(scanPos+i));
		let detectedBorder = detectBorderFromCoordinate(img, x, y, sin, cos);
		if(detectedBorder!=null)
		{
			let darkestRad = scanAngleRangeForDarkestLine(img.getContext('2d'), x, y, rad);
			return {x:x, y:y, rad:darkestRad};
		}
	}
	return null;
}
function detectBorderFromCoordinate(img, x, y, sin, cos) {
	const brightnessThreshold = 150;
	const darknessRatioThreshold = 0.7;
	img = img.getContext('2d');
	const width = img.canvas.width;
	const height = img.canvas.height;
	const imageData = img.getImageData(0, 0, width, height).data;
	const maxLineLength = Math.sqrt(width*width + height*height)/10;
	let linePoints = [];
	for(var i=0; i<maxLineLength; i++)
	{
		let pointX = Math.floor(x+(i*cos));
		let pointY = Math.floor(y+(i*sin));
		if((pointX>0)&&(pointX<width)&&(pointY>0)&&(pointY<height))
		{
			let brightnessAtPoint = imageData[4*(pointX+(pointY*width))]
			linePoints.push(brightnessAtPoint);
		}
	}
	const darkPoints = linePoints.filter(point => point < brightnessThreshold);
	if(darkPoints.length/linePoints.length>darknessRatioThreshold)
		return true;
	return null;
}
function scanAngleRangeForDarkestLine(imgContext, x, y, rad){
	const rangeSize = 0.25;
	const checkResolution = 0.001;
	let darkestRad = rad;
	let darkestLineSum = null;
	const width = imgContext.canvas.width;
	const height = imgContext.canvas.height;
	const imageData = imgContext.getImageData(0, 0, width, height).data;
	const maxLineLength = Math.min(width, height)/1;
	for(let i=0; i<rangeSize/checkResolution; i++){
		let tempRad = rad -(rangeSize/2)+i*checkResolution;
		let sin = Math.sin(tempRad);
		let cos = Math.cos(tempRad);
		let linePoints = [];
		for(let j=0; j<maxLineLength; j++)
		{
			let pointX = Math.floor(x+(j*cos));
			let pointY = Math.floor(y+(j*sin));
			if((pointX>0)&&(pointX<width)&&(pointY>0)&&(pointY<height))
			{
				let brightnessAtPoint = imageData[4*(pointX+(pointY*width))];
				linePoints.push(brightnessAtPoint);
			}
		}
		let averageSum = aggregator.sum(linePoints);
		if(averageSum<darkestLineSum||darkestLineSum==null)
		{
			darkestRad = tempRad;
			darkestLineSum = averageSum;
		}
	}
	return darkestRad;
}
export default {
	detectBorder
}
