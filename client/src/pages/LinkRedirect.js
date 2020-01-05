import React from 'react'
import server from '../services/server'
import QueryString from 'query-string';
import LoadSpinner from "../UIComponents/LoadSpinner/LoadSpinner";
export default class LinkRedirect extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		url: QueryString.parse(props.location.search, { ignoreQueryPrefix: true }).url,
		data: QueryString.parse(props.location.search, { ignoreQueryPrefix: true }).data,
	};
}
componentDidMount() {
	this.logUsage();
}
logUsage(){
	server.post('trackLink', {url: this.state.url, data: this.state.data})
		.then(() => {
			window.location.href = this.state.url;
		});
}
render() {
	return (
		<div style={{marginTop:"10em", transform:"scale(2, 2)"}}>
			<LoadSpinner visibility={true} align={"center"}/>
		</div>
	)
}
}
