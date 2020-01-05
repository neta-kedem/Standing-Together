import React from 'react';
import "./ContactScanDisplay.scss"
import { library } from '@fortawesome/fontawesome-svg-core'
import {faChevronUp, faChevronDown} from '@fortawesome/free-solid-svg-icons'
library.add(faChevronUp, faChevronDown);

export default class ContactScanDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.scanCanvas = React.createRef();
		this.scanDisplayWrap = React.createRef();
	};
	handleImageLoaded({target:img}){
		this.setState({scanWidth:img.naturalWidth, scanHeight:img.naturalHeight});
	}
	render() {
		const scan = <img src={"https://management.standing-together.org/uploads/contactScans/"+this.props.scanUrl} alt="scan" className="scan-canvas" onLoad={this.handleImageLoaded.bind(this)} ref={this.scanCanvas}/>;
		return (
			<div>

				<div className="scan-wrap">
					<div ref={this.scanDisplayWrap} className={"scan-display-wrap full-scan-display-wrap"}>
							{this.props.scanUrl?scan:""}
					</div>
				</div>
			</div>
		)
	}
}

