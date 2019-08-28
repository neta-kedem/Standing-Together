import fetch from 'node-fetch';
import config from './config';
import { withRouter} from "react-router";
import PubSub from "pubsub-js";
import events from "../lib/events";

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
		return handleResult(json);
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
		return handleResult(json);
	});
	return promise;
}

function handleResult(json){
	if(json.error === "missing token")
	{
		PubSub.publish(events.alert, {
			content: "you aren't logged in",
			flush: true,
			resolutionOptions: [
				{
					label: "ok",
					onClick: () => window.location.href = '/Login',
				}
			]
		});
		return [];
	}
	if(json.error === "missing permissions")
	{
		PubSub.publish(events.alert, {
			content: "you don't have permissions to view this page, switch user?",
			flush: true,
			resolutionOptions: [
				{
					label: "yes",
					onClick: () => window.location.href = '/Login',
				},
				{
					label: "no",
					onClick: () => window.location.href = '/Welcome',
				},
			]
		});
		return [];
	}
	return json;
}
export default withRouter({
    get,
    post
})
