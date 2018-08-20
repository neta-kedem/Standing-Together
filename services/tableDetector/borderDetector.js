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
			return {x:x, y:y};
		}
	}
	return null;
}
function detectBorderFromCoordinate(img, x, y, sin, cos) {
	const brightnessThreshold = 230;
	const darknessRatioThreshold = 0.7;
	img = img.getContext('2d');
	const width = img.canvas.width;
	const height = img.canvas.height;
	const imageData = img.getImageData(0, 0, width, height).data;
	const maxLineLength = Math.sqrt(width*width + height*height)/4;
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
export default {
	detectBorder
}
