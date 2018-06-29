import cookie from './cookieManager';
import Router from 'next/router';
import fetch from 'node-fetch';
import config from '../config';

const apiPath='api/';
function get(path){
	var promise = fetch(config.serverPath+apiPath+path, {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin'
	})
	.then(res => res.json())
	.then(json => {
		if(json.error=="missing token")
		{
			//Router.push({pathname: '/Login'});
			return [];
		}
		return json;
	});
	return promise;
}
function post(path, data){
	var promise = fetch(config.serverPath+apiPath+path, {
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
		if(json.error=="missing token")
		{
			Router.push({pathname: '/Login'});
		}
		return json;
	});
	return promise;
}
export default {
    get,
    post
}
