import aggregator from '../arrayAggregator';

function detectTopCorner(img, rowBulkSize, rowIndex) {
	img = img.getContext('2d');
	for(var i=0; i<rowBulkSize; i++)
	{
		var row = img.getImageData(0, rowIndex+i, img.canvas.width, 1);
		const cornerXSearch = scanRowForCorner(row, 1);
		if (cornerXSearch!=null)
		{
			return {x:scanRowForDarkestRange(row, 2), y:rowIndex+i};
		}
		return false;
	}
}
function detectBottomCorner(img, rowBulkSize, rowIndex) {
	img = img.getContext('2d');
	for(var i=0; i<rowBulkSize; i++)
	{
		var row = img.getImageData(0, img.canvas.height-(rowIndex+i), img.canvas.width, 1);
		const cornerXSearch = scanRowForCorner(row, -1);
		if (cornerXSearch!=null)
		{
			return {x:scanRowForDarkestRange(row, 2), y:img.canvas.height-(rowIndex+i)};
		}
		return false;
	}
}
function scanRowForCorner(row, dir) {
	const cornerWidthThreshold = 2;
	const cornerBrightnessThreshold = 200;
	if(dir==1)
	{
		for(var j=0; j<row.data.length-(cornerWidthThreshold*4); j+=4)
		{
			if(aggregator.avg(row.data.slice(j, j+(cornerWidthThreshold*4)))<cornerBrightnessThreshold)
			{
				return Math.floor(j/4);
			}
		}
	}
	if(dir==-1)
	{
		for(var j=row.data.length-(cornerWidthThreshold*4)-1; j>=0; j-=4)
		{
			if(aggregator.avg(row.data.slice(j, j+(cornerWidthThreshold*4)))<cornerBrightnessThreshold)
			{
				return Math.floor(j/4);
			}
		}
	}
	return null;
}
function scanRowForDarkestRange(row, rangeWidth){
	let darkestX = 0;
	let darkestAvg = 255;
	for(var j=0; j<row.data.length-(rangeWidth*4); j+=4)
	{
		const avgBrightness=aggregator.avg(row.data.slice(j, j+(rangeWidth*4)));
		if(avgBrightness<darkestAvg)
		{
			darkestX = Math.floor(j/4);
			darkestAvg = avgBrightness
		}
	}
	return darkestX;
}
export default {
	detectTopCorner,
    detectBottomCorner
}
