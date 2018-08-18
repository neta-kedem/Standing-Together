import aggregator from '../arrayAggregator';

function detectCornerInRange(img, rowIndex, dir, rowBulkSize, alreadyDetected) {
	img = img.getContext('2d');
	let rowStart = 0;
	let rowEnd = img.canvas.width;
	if(alreadyDetected!=null)
	{
		rowEnd = rowEnd/2;
		if(alreadyDetected.x<rowEnd)
		{
			rowStart = rowEnd;
		}
	}
	for(var i=0; i<rowBulkSize; i++)
	{
		const rowY = (dir==1)?rowIndex+i:img.canvas.height-(rowIndex+i);
		var row = img.getImageData(rowStart, rowY, rowEnd, 1);
		const cornerXSearch = scanRowForCorner(row, rowStart>0?-1:1);
		if (cornerXSearch!=null)
		{
			return {x:cornerXSearch+rowStart, y:rowY};
		}
		return false;
	}
}
function scanRowForCorner(row, dir) {
	const cornerWidthThreshold = 5;
	const cornerBrightnessThreshold = 230;
	const rowWidth = row.data.length/4;
	if(dir==1)
	{
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
	}
	if(dir==-1)
	{
		for(var j=row.data.length-(cornerWidthThreshold*4)-1; j>=0; j-=4)
		{
			//calculate avg brightness of the currently scanned portion of the row
			const rangeBrightness = aggregator.avg(row.data.slice(j, j+(cornerWidthThreshold*4)));
			//if it is lower than the threshold
			if(rangeBrightness<cornerBrightnessThreshold)
			{
				//x coordinate of the area which was determined to be pretty dark
				const darkRangeX = Math.floor(j/4);
				return scanRowForOuterDarkPixel(row, rangeBrightness*1.1, darkRangeX>(rowWidth/2)?-1:1);
			}
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
