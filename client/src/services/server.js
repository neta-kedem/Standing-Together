import fetch from 'node-fetch';
import config from './config';
import { withRouter } from "react-router";
import PubSub from "pubsub-js";
import serverAlerts from "./serverAlerts";
import events from "../lib/events";
import React from "react";
import UnsuspendSession from "../UIComponents/UnsuspendSession/UnsuspendSession";

const apiPath='api/';
let refetchQueue = [];
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
		return handleResult(json, "get", path);
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
		return handleResult(json, "post", path, data);
	});
	return promise;
}

function handleResult(json, method, path, data){
	return new Promise((resolve) => {
		if(json.error === "missing token")
		{
			PubSub.publish(events.alert, serverAlerts.missingToken);
		}
		else if(json.error === "missing permissions")
		{
			PubSub.publish(events.alert, serverAlerts.missingPermission);
		}
		else if(json.error === "suspended session")
		{
			refetchQueue.push(() => {
				refetch(method, path, data).then((result) => {
					resolve(result)
				})
			});
			const onUnsuspend = () => {
				PubSub.publish(events.clearAlert, {clearAll: true});
				runRefetchQueue();
			};
			const popupOptions = {
				content: <UnsuspendSession onSuccess={onUnsuspend}/>,
				flush: true,
				opaque: true,
				onClose: () => window.location.href = '/Login',
			};
			PubSub.publish(events.alert, popupOptions);
		}
		else{
			resolve(json);
		}
	});
}

//called after a session is un-suspended
function refetch(method, path, data){
	if(method === "post"){
		return post(path, data)
	}
	if(method === "get"){
		return get(path)
	}
	return new Promise((resolve)=>{resolve([]);})
}

//recall all suspended server calls
function runRefetchQueue(){
	for(let i = 0; i < refetchQueue.length; i++){
		refetchQueue[i]();
	}
	refetchQueue = [];
}

export default withRouter({
    get,
    post
})
