import aggregator from '../arrayAggregator';
function detectOuterEdgeFromCorner(img, x, y, rad, checkDelta, speed) {
	const points = getFuzzyCornerCoordinates(img, x, y, rad);
	const imgContext = img.getContext('2d');
	const imgData = imgContext.getImageData(0, 0, img.width, img.width).data;
	for(let i=0; i<speed; i++)
	{
		let sin = Math.sin(rad+(i*checkDelta));
		let cos = Math.cos(rad+(i*checkDelta));
		for(let j=0; j<points.length; j++)
		{
			let detection = detectOuterEdgeFromCoordinate(imgContext, imgData, points[j].x, points[j].y, sin, cos);
			if(detection!=null)
				return {"x":points[j].x, "y":points[j].y, "rad":rad+(i*checkDelta)};
		}
	}
	return null;
}
function getFuzzyCornerCoordinates(img, x, y, rad){
	let sin = Math.sin(rad);
	let cos = Math.cos(rad);
	const fuzziness = 4;
	let points = [];
	const width = img.width;
	const height = img.height;
	for(let i=-fuzziness; i<fuzziness; i++)
	{
		//x is added sin, and y is added cos on purpose - because the fuzzyness should be perpendicular to the angle of the checked line
		let tempX = Math.round(x+(i*sin));
		let tempY = Math.round(y+(i*cos));
		if((tempX>0)&&(tempX<width)&&(tempY>0)&&(tempY<height))
			points.push({"x":tempX, "y":tempY});
	}
	return aggregator.uniq(points);
}
function detectOuterEdgeFromCoordinate(imgContext, imgData, x, y, sin, cos) {
	const brightnessThreshold = 200;
	const darknessRatioThreshold = 0.5;
	const width = imgContext.canvas.width;
	const height = imgContext.canvas.height;
	const maxLineLength = Math.min(width, height)/1;
	let linePoints = [];
	for(let i=0; i<maxLineLength; i++)
	{
		let pointX = Math.floor(x+(i*cos));
		let pointY = Math.floor(y+(i*sin));
		if((pointX>0)&&(pointX<width)&&(pointY>0)&&(pointY<height))
		{
			let brightnessAtPoint = imgData[4*(pointX+(pointY*width))];
			linePoints.push(brightnessAtPoint);
		}
	}
	const darkPoints = linePoints.filter(point => point < brightnessThreshold);
	if(darkPoints.length/linePoints.length>darknessRatioThreshold)
		return true;
	return null;
	
}
export default {
	detectOuterEdgeFromCorner
}
