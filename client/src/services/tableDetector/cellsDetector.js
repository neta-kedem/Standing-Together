function detectCells(verticalBorders, horizontalBorders) {
	let cellsArray = [];
	for (var i=0; i<verticalBorders.length-1; i++)
	{
		for (var j=0; j<horizontalBorders.length-1; j++)
		{
			//an array representing a cell, each element is a corner,
			//represented an array of the indexes of the vertical and horizontal borders on which the corner rests.
			let corners = [[i, j],[i+1, j],[i+1, j+1],[i, j+1]];
			let cornersCoordinates = [];
			for (var k=0; k<corners.length; k++)
			{
				cornersCoordinates.push(linesIntersection(
					verticalBorders[corners[k][0]].x, verticalBorders[corners[k][0]].y, verticalBorders[corners[k][0]].rad,
					horizontalBorders[corners[k][1]].x, horizontalBorders[corners[k][1]].y, horizontalBorders[corners[k][1]].rad
				));
			}
			cellsArray.push(cornersCoordinates);
		}
	}
	return cellsArray;
}
function linesIntersection(x1, y1, rad1, x2, y2, rad2) {
	const m1 = Math.tan(rad1);
	const n1 = (-m1*x1)+y1;
	const m2 = Math.tan(rad2);
	const n2 = (-m2*x2)+y2;
	const xRes = ((n2-n1)/(m1-m2));
	const yRes = (xRes*m1+n1);
	if(m1>50)
	{
		return {x: x1, y: y2};
	}
	if(m2>50)
		return {x: x2, y: y1};
	return {x: xRes, y: yRes};
}
export default {
	detectCells
}
