import fetch from 'node-fetch';
import config from './config';
import { withRouter} from "react-router";

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
			if(window.confirm("you don't have permissions to view this page, switch user?"))
			{
				window.location.href = '/Login';
			}
			else{
				window.location.href = '/Welcome';
			}
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
			if(window.confirm("you don't have permissions to view this page, switch user?"))
			{
				window.location.href = '/Login';
			}
			else{
				window.location.href = '/Welcome';
			}
			return null;
		}
		return json;
	});
	return promise;
}
export default withRouter({
    get,
    post
})
