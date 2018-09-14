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
function uniq(arr) {
    const prims = {"boolean":{}, "number":{}, "string":{}};
	let objs = [];

    return arr.filter(function(item) {
        let type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}
export default {
	sum,
    avg,
	uniq
}
