//graphics
import sd from '../../services/canvas/shapeDrawer';

function drawCornerScanner(ctx, pos){
	ctx.lineWidth=5;
	ctx.strokeStyle="#FF4C94";
	ctx.globalAlpha=0.2;
	sd.drawLine(ctx, 0, pos, ctx.canvas.width, pos);
	ctx.lineWidth=1;
	ctx.globalAlpha=1;
	ctx.strokeStyle="#FF4C94";
	sd.drawLine(ctx, 0, pos, ctx.canvas.width, pos);
}

function drawDetectedCorner(ctx, x, y){
	ctx.fillStyle="#90278e";
	sd.fillOval(ctx, x, y, 6);
}
function drawOuterBorderScanner(ctx, x1, y1, rad){
	const maxLineLength = Math.sqrt(ctx.canvas.width*ctx.canvas.width + ctx.canvas.height*ctx.canvas.height);
	let x2 = x1+(maxLineLength*Math.cos(rad));
	let y2 = y1+(maxLineLength*Math.sin(rad));
	ctx.lineWidth=5;
	ctx.strokeStyle="#FF4C94";
	ctx.globalAlpha=0.2;
	sd.drawLine(ctx, x1, y1, x2, y2);
	ctx.lineWidth=1;
	ctx.globalAlpha=1;
	ctx.strokeStyle="#FF4C94";
	sd.drawLine(ctx, x1, y1, x2, y2);
}
function drawOuterBorder(ctx, x1, y1, rad){
	ctx.lineWidth=3;
	ctx.strokeStyle="#90278e";
	const maxLineLength = Math.sqrt(ctx.canvas.width*ctx.canvas.width + ctx.canvas.height*ctx.canvas.height);
	let x2 = x1+(maxLineLength*Math.cos(rad));
	let y2 = y1+(maxLineLength*Math.sin(rad));
	sd.drawLine(ctx, x1, y1, x2, y2);
}
function drawBorderScanner(ctx, x1, y1, rad){
	const maxLineLength = Math.sqrt(ctx.canvas.width*ctx.canvas.width + ctx.canvas.height*ctx.canvas.height);
	let x2 = x1+(maxLineLength*Math.cos(rad));
	let y2 = y1+(maxLineLength*Math.sin(rad));
	ctx.lineWidth=5;
	ctx.strokeStyle="#FF4C94";
	ctx.globalAlpha=0.2;
	sd.drawLine(ctx, x1, y1, x2, y2);
	ctx.globalAlpha=1;
	ctx.lineWidth=1;
	ctx.strokeStyle="#FF4C94";
	sd.drawLine(ctx, x1, y1, x2, y2);
}
function drawBorder(ctx, x1, y1, rad){
	ctx.lineWidth=2;
	ctx.strokeStyle="#90278e";
	const maxLineLength = Math.sqrt(ctx.canvas.width*ctx.canvas.width + ctx.canvas.height*ctx.canvas.height);
	let x2 = x1+(maxLineLength*Math.cos(rad));
	let y2 = y1+(maxLineLength*Math.sin(rad));
	sd.drawLine(ctx, x1, y1, x2, y2);
}
/*----not used!----*/
function fillCells(ctx, cells){
	for(var i=0; i<cells.length; i++)
	{
		ctx.fillStyle="#FF4C94";
		ctx.globalAlpha=0.2;
		sd.fillPolygon(ctx, cells[i]);
		ctx.globalAlpha=1;
		ctx.strokeStyle="#00AA88";
		sd.strokePolygon(ctx, cells[i]);
	}
	
}
export default {
	drawCornerScanner,
	drawDetectedCorner,
	drawOuterBorderScanner,
	drawOuterBorder,
	drawBorderScanner,
	drawBorder,
	fillCells
}
