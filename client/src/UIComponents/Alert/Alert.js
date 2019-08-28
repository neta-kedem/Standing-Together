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
		const opaque = curr.opaque || false;
		const resolutionOptions = curr.resolutionOptions ? curr.resolutionOptions : [];
		return queue.length ? (
			<div className="alert-wrapper">
				<div className={"alert-background " + (opaque ? "opaque " : "")} onClick={this.close}/>
				<div className="alert" style={{
					width: curr.width ? curr.width : "50%",
					height: curr.height ? curr.height : "fit-content"
				}}>
					<div className={"alert-content-wrap"}>
						{curr.content}
					</div>
					<div className={"alert-options-wrap"}>
						{
							resolutionOptions.map((o, i) => {
								return (
									<button type={"button"} onClick={o.onClick} key={i} className={"alert-option"}>
										{o.label}
									</button>
								)
							})
						}
					</div>
				</div>
			</div>
		):<div/>
	}
}
