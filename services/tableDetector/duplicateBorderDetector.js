function isBorderNonDuplicate(borders, newBorder) {
	//the minimum allowed distance between two borders,
	//(if the distance is less than that, the border will be considered a duplicate),
	//squared - in order to spare an unnecessary square root
	const minBorderDistSquared = 16;
	for(var i=0; i<borders.length; i++)
	{
		let distSquared=Math.pow(newBorder.x-borders[i].x, 2)+Math.pow(newBorder.y-borders[i].y, 2);
		if (distSquared<minBorderDistSquared)
		{
			return false;
		}
	}
	return true;
}
export default {
	isBorderNonDuplicate
}
