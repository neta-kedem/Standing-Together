import aggregator from '../arrayAggregator';

function detectCornerInRange(img, rowIndex, dir, rowBulkSize) {
	img = img.getContext('2d');
	let rowStart = 0;
	for(var i=0; i<rowBulkSize; i++)
	{
		const rowY = (dir==1)?rowIndex+i:img.canvas.height-(rowIndex+i);
		var row = img.getImageData(0, rowY, img.canvas.width, 1);
		const cornerXSearch = scanRowForCorner(row);
		if (cornerXSearch!=null)
		{
			return {x:cornerXSearch, y:rowY};
		}
		return false;
	}
}
function scanRowForCorner(row) {
	const cornerWidthThreshold = 5;
	const cornerBrightnessThreshold = 230;
	const rowWidth = row.data.length/4;
	for(var j=0; j<row.data.length-(cornerWidthThreshold*4); j+=4)
	{
		//calculate avg brightness of the currently scanned portion of the row
		const rangeBrightness = aggregator.avg(row.data.slice(j, j+(cornerWidthThreshold*4)));
		//if it is lower than the threshold
		if(rangeBrightness<cornerBrightnessThreshold)
		{
			//x coordinate of the area which was determined to be pretty dark
			const darkRangeX = Math.floor(j/4);
			return scanRowForOuterDarkPixel(row, rangeBrightness*1.15, darkRangeX>(rowWidth/2)?-1:1);
		}
	}
	return null;
}
function scanRowForOuterDarkPixel(row, threshold, dir){
	for(var j=0; j<row.data.length-4; j+=4)
	{
		const rowX = (dir==1)?j:row.data.length-j-4;
		const avgBrightness=aggregator.avg(row.data.slice(rowX, rowX+4));
		if(avgBrightness<=threshold)
		{
			return Math.floor(rowX/4);
		}
	}
	return null;
}
export default {
	detectCornerInRange
}
