function avg(arr) {
	if(!arr.length)
		return null;
	let avg = 0;
    for(var i=0; i<arr.length; i++)
		avg+=arr[i];
	return avg/arr.length;
		
}
function sum(arr) {
	if(!arr.length)
		return 0;
	let sum = 0;
    for(var i=0; i<arr.length; i++)
		sum+=arr[i];
	return sum;
		
}
export default {
	sum,
    avg
}
