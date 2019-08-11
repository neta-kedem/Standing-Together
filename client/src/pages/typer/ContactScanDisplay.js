import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import {faChevronUp, faChevronDown} from '@fortawesome/free-solid-svg-icons'
library.add(faChevronUp, faChevronDown);

export default class ContactScanDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			scanUrl: props.scanUrl,
			selectedRow: (props.selectedRow==null)?0:props.selectedRow,
		};
		this.scanCanvas = React.createRef();
		this.scanDisplayWrap = React.createRef();
	};
	componentWillReceiveProps(nextProps) {
		// You don't have to do this check first, but it can help prevent an unneeded render
		if (nextProps.scanUrl && !this.state.scanUrl) {
			this.setState({scanUrl: nextProps.scanUrl});
		}
		if (nextProps.selectedRow!=null && this.state.selectedRow !== nextProps.selectedRow) {
			this.setState({selectedRow: nextProps.selectedRow});
		}
	}
	handleImageLoaded({target:img}){
		this.setState({scanWidth:img.naturalWidth, scanHeight:img.naturalHeight});
	}
	render() {
		const scan = <img src={"../uploads/contactScans/"+this.state.scanUrl} alt="scan" className="scan-canvas" onLoad={this.handleImageLoaded.bind(this)} ref={this.scanCanvas}/>;
		return (
			<div>

				<div className="scan-wrap">
					<div ref={this.scanDisplayWrap} className={"scan-display-wrap full-scan-display-wrap"}>
							{this.state.scanUrl?scan:""}
					</div>
				</div>
			</div>
		)
	}
}

