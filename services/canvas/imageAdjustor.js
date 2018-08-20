function drawImage(context, img, x, y, width, height){
	//handle unloaded images
	if(!img){
		console.error("can't draw an unloaded image");
		return;
	}
	//in case no width and height were provided
	if(arguments.length==4)
	{
		context.drawImage(img, x, y);
		return;
	}
	//in case width and height were provided
	else if(arguments.length==6)
	{
		context.drawImage(img, x, y, width, height);
		return;
	}
	//otherwise
	else console.error("invalid parameter number");
}
function desaturateImage(img){
	let imageData = img.getImageData(0, 0, img.canvas.width, img.canvas.height);
	let data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
		var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
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
function contrastImage(img, contrast){
	let imageData = img.getImageData(0, 0, img.canvas.width, img.canvas.height);
	let data = imageData.data;
    contrast = contrast + 1;  //convert to decimal & shift range: [0..2]
    const intercept = 128 * (1 - contrast);
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
export default {
	drawImage,
    desaturateImage,
	contrastImage,
	setImageBrightness
}
