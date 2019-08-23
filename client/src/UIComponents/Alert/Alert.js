import React from 'react';
import "./Alert.scss";

export default class Alert extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			setQueue: props.setQueue
		};
	}

	close = function() {
		const queue = this.props.queue;
		const curr = queue.splice(0, 1)[0];
		if(curr.onClose)
			curr.onClose();
		this.state.setQueue(queue);
	}.bind(this);

	render() {
		const queue = this.props.queue;
		const curr = queue.length ? queue[0] : {};
		return queue.length ? (
			<div className="alert-wrapper">
				<div className="alert-background" onClick={this.close}/>
				<div className="alert" style={{
					width: curr.width ? curr.width : "50%",
					height: curr.height ? curr.height : "fit-content"
				}}>
					{curr.content}
				</div>
			</div>
		):<div/>
	}
}
