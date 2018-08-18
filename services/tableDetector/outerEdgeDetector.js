import aggregator from '../arrayAggregator';
function detectOuterEdgeFromCorner(img, x, y, rad, checkDelta, speed) {
	const points = getFuzzyCornerCoordinates(img, x, y, rad);
	for(var i=0; i<speed; i++)
	{
		let sin = Math.sin(rad+(i*checkDelta));
		let cos = Math.cos(rad+(i*checkDelta));
		for(var j=0; j<points.length; j++)
		{
			let detection = detectOuterEdgeFromCoordinate(img, points[j].x, points[j].y, sin, cos);
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
	for(var i=-fuzziness; i<fuzziness; i++)
	{
		let tempX = x+(i*cos);
		let tempY = y+(i*sin);
		if((tempX>0)&&(tempX<width)&&(tempY>0)&&(tempY<height))
			points.push({"x":tempX, "y":tempY});
	}
	return points;
}
function detectOuterEdgeFromCoordinate(img, x, y, sin, cos) {
	const threshold = 200;
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
	const avgBrightness = aggregator.avg(linePoints);
	if(avgBrightness!=null&&avgBrightness<threshold)
		return true;
	return null;
	
}
export default {
	detectOuterEdgeFromCorner
}
