import fetch from 'node-fetch';
import config from './config';
import { withRouter } from "react-router";
import PubSub from "pubsub-js";
import events from "../lib/events";
import React from "react";
import UnsuspendSession from "../UIComponents/UnsuspendSession/UnsuspendSession";

const apiPath='api/';
let refetchQueue = [];

function get(path){
	return fetch(config.serverPath+apiPath+path, {
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
}
function post(path, data){
	return fetch(config.serverPath+apiPath+path, {
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
}

function handleResult(json, method, path, data){
	const currPosition = encodeURIComponent(window.location.pathname + window.location.search);
	return new Promise((resolve) => {
		if(json.error === "missing token")
		{
			PubSub.publish(events.alert, alerts("missingToken", currPosition));
		}
		else if(json.error === "missing permissions")
		{
			PubSub.publish(events.alert, alerts("missingPermission", currPosition));
		}
		else if(json.error === "suspended session")
		{
			refetchQueue.push(() => {
				refetch(method, path, data).then((result) => {
					resolve(result)
				})
			});
			PubSub.publish(events.alert, alerts("suspendedSession", currPosition));
		}
		else{
			resolve(json);
		}
	});
}


function alerts (type, path) {
	switch(type){
		case "missingPermission": return {
			content: "you don't have permissions to view this page, switch user?",
				flush: true,
				opaque: true,
				onClose: () => window.location.href = '/Login?redirect=' + path,
				resolutionOptions: [
				{
					label: "yes",
					onClick: () => window.location.href = '/Login?redirect=' + path,
				},
				{
					label: "no",
					onClick: () => window.location.href = '/Welcome',
				},
			]
		};
		case "missingToken": return {
			content: "you aren't logged in",
				flush: true,
				opaque: true,
				onClose: () => window.location.href = '/Login?redirect=' + path,
				resolutionOptions: [
				{
					label: "ok",
					onClick: () => window.location.href = '/Login?redirect=' + path,
				}
			]
		};
		case "suspendedSession": return {
			content: <UnsuspendSession onSuccess={() => {
				PubSub.publish(events.clearAlert, {clearAll: true});
				runRefetchQueue();
			}}/>,
				flush: true,
				opaque: true,
				onClose: () => window.location.href = '/Login?redirect=' + path,
		};
	}
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
