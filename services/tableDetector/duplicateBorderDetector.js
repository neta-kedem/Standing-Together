function isBorderNonDuplicate(borders, newBorder, isHorizontal) {
	//the minimum allowed distance between two borders along either axis
	const minBorderDist = 8;
	for(var i=0; i<borders.length; i++)
	{
		if (isHorizontal&&Math.abs(newBorder.y-borders[i].y)<minBorderDist)
		{
			return false;
		}
		if(!isHorizontal&&Math.abs(newBorder.x-borders[i].x)<minBorderDist)
		{
			return false;
		}
	}
	return true;
}
export default {
	isBorderNonDuplicate
}
