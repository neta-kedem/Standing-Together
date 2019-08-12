import fetch from 'node-fetch';
import config from './config';

const apiPath='api/';
function get(path){
	const promise = fetch(config.serverPath+apiPath+path, {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin'
	})
	.then(res => res.json())
	.then(json => {
		if(json.error === "missing token")
		{
			this.props.history.push('/Login');
			return [];
		}
		return json;
	});
	return promise;
}
function post(path, data){
	const promise = fetch(config.serverPath+apiPath+path, {
		method: 'post',
		body: JSON.stringify(data),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin'
	})
	.then(res => res.json())
	.then(json => {
		if(json.error === "missing token")
		{
			this.props.history.push('/Login');
			return null;
		}
		return json;
	});
	return promise;
}
/*
not sure why this doesn't work:
server.uploadFile("contactScan", event.target.files[0], "scan");
function uploadFile(path, file, name){
	var formWrap = new FormData();
	formWrap.append(name, file);
	var promise = fetch(config.serverPath+apiPath+path, {
		headers: {
			'Accept': 'application/json, application/xml, text/play, text/html, *.*'
		},
		credentials: 'same-origin',
		method: 'POST',
		body: formWrap
	})
	.then(res => res.json())
	.then(json => {
		if(json.error=="missing token")
		{
			Router.push({pathname: '/Login'});
		}
		return json;
	});
	return promise;
}*/
export default {
    get,
    post
}
