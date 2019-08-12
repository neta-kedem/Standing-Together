function drawImage(context, img, x, y, width, height){
	//handle unloaded images
	if(!img || !img.complete){
		//console.error("can't draw an unloaded image");
		return;
	}
	//in case no width and height were provided
	if(arguments.length === 4)
	{
		context.drawImage(img, x, y);
	}
	//in case width and height were provided
	else if(arguments.length === 6)
	{
		context.drawImage(img, x, y, width, height);
	}
	//otherwise
	else console.error("invalid parameter number");
}
function threshold(img, threshold, radius, p){
	const width = img.canvas.width;
	const height = img.canvas.height;
	let imageData = img.getImageData(0, 0, width, height);
	let data = imageData.data;
	let brightnessSums = [];
	for (let i=0; i<width-radius; i++)
	{
		//the index of the [i]th cell in the first row
		let baseRowIndex = i*4;
		for (let j=0; j<height-radius; j++)
		{
			//the index of the [j]th cell in the currently scanned column
			let baseColIndex = (j*width)*4;
			//this will hold the sum of the brightness of all the pixels within a square of length [radius] whose a top-left corner is at [i, j]
			let squareSum = 0;
			for (let k=0; k<radius; k++)
			{
				let rowIndex=baseRowIndex+k*4;
				for (let l=0; l<radius; l++)
				{
					let colIndex=baseColIndex+(l*width)*4;
					squareSum+=data[colIndex+rowIndex];
				}
			}
			//save the sum into the sum array for each scanned pixel
			for (let k=0; k<radius; k++)
			{
				for (let l=0; l<radius; l++)
				{
					if(!brightnessSums[i+k])
						brightnessSums[i+k]=[];
					if(!brightnessSums[i+k][j+l])
						brightnessSums[i+k][j+l]=[];
					brightnessSums[i+k][j+l].push(squareSum);
				}
			}
		}
	}
	for (let i=0; i<width-1; i++)
	{
		//the index of the [i]th cell in the first row
		let rowIndex = i*4;
		for (let j=0; j<height-1; j++)
		{
			//the index of the [j]th cell in the currently scanned column
			let colIndex = (j*width)*4;
			//the brightness at the currently scanned pixel times the radius squared (because we test it against the sum of pixels in the vicinity
			let currPixelBrightness = data[colIndex+rowIndex]*radius*radius;
			//for each pixel, we check all the brightness sums around it. Each check produces a result - 1 or 0, which is added to this variable
			let binaryChecks = 0;
			//iterate over the sums 
			for(let k=0; k<brightnessSums[i][j].length; k++)
			{
				let brightnessThreshold = brightnessSums[i][j][k]*threshold;
				if(brightnessThreshold>currPixelBrightness)
					binaryChecks++;
			}
			if(binaryChecks/brightnessSums[i][j].length>p)
			{
				data[colIndex+rowIndex] = 0;
				data[colIndex+rowIndex+1] = 0;
				data[colIndex+rowIndex+2] = 0;
			}
			else
			{
				data[colIndex+rowIndex] = 255;
				data[colIndex+rowIndex+1] = 255;
				data[colIndex+rowIndex+2] = 255;
			}
		}
	}
	img.putImageData(imageData, 0 ,0);
}
function desaturateImage(img){
	let imageData = img.getImageData(0, 0, img.canvas.width, img.canvas.height);
	let data = imageData.data;
	for (let i = 0; i < data.length; i += 4) {
		let brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
		// red
		data[i] = brightness;
		// green
		data[i + 1] = brightness;
		// blue
		data[i + 2] = brightness;
	}
	// overwrite original image
	img.putImageData(imageData, 0 ,0);
}
//contrast between -1 and 1
function contrastImage(img, contrast, mid){
	let imageData = img.getImageData(0, 0, img.canvas.width, img.canvas.height);
	let data = imageData.data;
    contrast = contrast + 1;  //convert to decimal & shift range: [0..2]
    const intercept = mid * (1 - contrast);
    for(var i=0;i<data.length;i+=4){   //r,g,b,a
        data[i] = data[i]*contrast + intercept;
        data[i+1] = data[i+1]*contrast + intercept;
        data[i+2] = data[i+2]*contrast + intercept;
    }
    // overwrite original image
	img.putImageData(imageData, 0 ,0);
}
//set brightness
function setImageBrightness(img, brightness){
	let imageData = img.getImageData(0, 0, img.canvas.width, img.canvas.height);
	let data = imageData.data;
    for(var i=0;i<data.length;i+=4){   //r,g,b,a
        data[i] = data[i]*brightness;
        data[i+1] = data[i+1]*brightness;
        data[i+2] = data[i+2]*brightness;
    }
    // overwrite original image
	img.putImageData(imageData, 0 ,0);
}
function rotateImg(ctx, clockwise){
	const canvas = 	ctx.canvas;
	const myImageData = new Image();
	myImageData.src = canvas.toDataURL();
	myImageData.onload = () => {
		//original dimensions of the canvas
		const oWidth = canvas.width;
		canvas.width = canvas.height;
		canvas.height = oWidth;
		ctx.rotate(Math.PI / 2 * (clockwise ? 1 : -1));
		if(clockwise)
			ctx.drawImage(myImageData, 0, -canvas.width);
		else
			ctx.drawImage(myImageData, -canvas.height, 0);
		ctx.restore();
	};
}
export default {
	threshold,
	drawImage,
    desaturateImage,
	contrastImage,
	setImageBrightness,
	rotateImg
}
