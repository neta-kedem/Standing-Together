//graphics
import sd from '../../services/canvas/shapeDrawer';

function drawCornerScanner(ctx, pos){
	ctx.strokeStyle="#AAFF00";
	sd.drawLine(ctx, 0, pos, ctx.canvas.width, pos);
}

function drawDetectedCorner(ctx, x, y){
	ctx.fillStyle="#008855";
	sd.fillOval(ctx, x, y, 6);
}
function drawOuterBorderScanner(ctx, x1, y1, rad){
	ctx.strokeStyle="#AAFF00";
	const maxLineLength = Math.sqrt(ctx.canvas.width*ctx.canvas.width + ctx.canvas.height*ctx.canvas.height);
	let x2 = x1+(maxLineLength*Math.cos(rad));
	let y2 = y1+(maxLineLength*Math.sin(rad));
	sd.drawLine(ctx, x1, y1, x2, y2);
}
function drawOuterBorder(ctx, x1, y1, rad){
	ctx.strokeStyle="#008855";
	const maxLineLength = Math.sqrt(ctx.canvas.width*ctx.canvas.width + ctx.canvas.height*ctx.canvas.height);
	let x2 = x1+(maxLineLength*Math.cos(rad));
	let y2 = y1+(maxLineLength*Math.sin(rad));
	sd.drawLine(ctx, x1, y1, x2, y2);
}
export default {
	drawCornerScanner,
	drawDetectedCorner,
	drawOuterBorderScanner,
	drawOuterBorder
}
