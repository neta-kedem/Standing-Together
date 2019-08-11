import React from 'react';
import style from './ContactScanDisplay.css'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronUp, faChevronDown} from '@fortawesome/free-solid-svg-icons'
library.add(faChevronUp, faChevronDown);

export default class ContactScanDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			scanUrl: props.scanUrl,
			selectedRow: (props.selectedRow==null)?0:props.selectedRow,
		};
		this.scanDisplay = React.createRef();
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
		//width percentage - 100 divided by the width of the canvas
		const wp = this.state.scanWidth?100/this.state.scanWidth:0.1;
		//height percentage - 100 divided by the height of the canvas
		const hp = this.state.scanHeight?100/this.state.scanHeight:0.1;
		return (
			<div>
				<style jsx global>{style}</style>
				<div className="scan-wrap">
					<div ref={this.scanDisplayWrap} className={"scan-display-wrap full-scan-display-wrap"}>
							{this.state.scanUrl?scan:""}
					</div>
				</div>
			</div>
		)
	}
}

