function drawLine(ctx, x1, y1, x2, y2)
{
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
}
function drawOval(ctx, x, y, radius)
{
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.stroke();
}
function fillOval(ctx, x, y, radius)
{
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
}
function fillPolygon(ctx, points)
{
	if(points.length<2)
	{
		console.error("at least 3 points are required to draw a polygon");
		return;
	}
	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	for(var i=0; i<points.length; i++)
	{
		ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.closePath();
	ctx.fill();
}
function strokePolygon(ctx, points)
{
	if(points.length<2)
	{
		console.error("at least 3 points are required to draw a polygon");
		return;
	}
	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	for(var i=0; i<points.length; i++)
	{
		ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.closePath();
	ctx.stroke();
}
export default {
	drawLine,
    drawOval,
	fillOval,
	fillPolygon,
	strokePolygon
}
