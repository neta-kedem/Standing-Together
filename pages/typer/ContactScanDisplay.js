import React from 'react';
import style from './ContactScanDisplay.css'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {faChevronUp, faChevronDown} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faChevronUp, faChevronDown);

export default class ContactScanDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cells: props.cells,
			scanUrl: props.scanUrl,
			selectedRow: (props.selectedRow==null)?0:props.selectedRow,
			selectScanRow: props.selectScanRow
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
		if (nextProps.cells) {
			this.setState({cells: nextProps.cells});
		}
		if (nextProps.selectedRow!=null && this.state.selectedRow !== nextProps.selectedRow) {
			this.setState({selectedRow: nextProps.selectedRow});
		}
	}
	handleImageLoaded({target:img}){
		this.setState({scanWidth:img.naturalWidth, scanHeight:img.naturalHeight});
	}
	selectScanRow(num)
	{
		if(num>=0&&num<this.state.cells.length)
		{
			this.setState({selectedRow: num});
			this.state.selectScanRow(num);
		}
	}
	render() {
		const scan = <img src={"../uploads/contactScans/"+this.state.scanUrl} alt="scan" className="scan-canvas" onLoad={this.handleImageLoaded.bind(this)} ref={this.scanCanvas}/>;
		//width percentage - 100 divided by the width of the canvas
		const wp = this.state.scanWidth?100/this.state.scanWidth:0.1;
		//height percentage - 100 divided by the height of the canvas
		const hp = this.state.scanHeight?100/this.state.scanHeight:0.1;
		const cells=this.state.cells;
		const selectedRow=this.state.selectedRow;
		const cellsOverlay = cells.map((row, i)=>{
			const cells = row.cells.map((cell, j)=>{
				return <div className="detected-table-cell"
					key={j}
					style={{clipPath: "polygon("+
						cell.corners[0].x*wp+"% "+cell.corners[0].y*hp+"%, "+
						cell.corners[1].x*wp+"% "+cell.corners[1].y*hp+"%, "+
						cell.corners[2].x*wp+"% "+cell.corners[2].y*hp+"%, "+
						cell.corners[3].x*wp+"% "+cell.corners[3].y*hp+"%"+
					")"}}
				> </div>;
			});
			return <div className={"detected-table-row "+(i === selectedRow?"selected-table-row ":"")} key={i}>{cells}</div>;
		});
		//calculate the direction of the selected row, in order to even out the image horizontally
		let rotationOffset = 0;
		let positionOffset = 0;
		if(cells&&cells.length>0)
		{
			const selectedX1 = cells[selectedRow].cells[0].corners[0].x;
			const selectedX2 = cells[selectedRow].cells[cells[selectedRow].cells.length-1].corners[0].x;
			const selectedY1 = cells[selectedRow].cells[0].corners[0].y;
			const selectedY2 = cells[selectedRow].cells[cells[selectedRow].cells.length-1].corners[0].y;
			rotationOffset = -Math.atan((selectedY1-selectedY2)/(selectedX1-selectedX2))/Math.PI*180;
			const scanDisplayWidth = this.scanDisplay.current?this.scanDisplay.current.clientWidth:1;
			const scanCanvasWidth = this.scanCanvas.current?this.scanCanvas.current.naturalWidth:1;
			const scanDisplayWrapHeight = this.scanDisplayWrap.current?this.scanDisplayWrap.current.clientHeight:1;
			//vertically focus on the highlighted row
			const selectedY1Bottom = cells[selectedRow].cells[0].corners[2].y;
			positionOffset = -(selectedY1+selectedY2 + Math.abs(selectedY1 - selectedY1Bottom))/2/scanCanvasWidth*scanDisplayWidth;
			//vertically center inside the highlighted row
			positionOffset += scanDisplayWrapHeight/2;
		}
		return (
			<div>
				<style jsx global>{style}</style>
				<div className="scan-wrap">
					{this.state.cells != null?<div className="row-nav-wrap">
						<button className="row-nav row-nav-up" onClick={() => this.selectScanRow(selectedRow-1)}>
							<FontAwesomeIcon icon="chevron-up"/>
						</button>
						<button className="row-nav row-nav-down" onClick={() => this.selectScanRow(selectedRow+1)}>
							<FontAwesomeIcon icon="chevron-down"/>
						</button>
					</div>:""}
					<div ref={this.scanDisplayWrap} className={"scan-display-wrap "+((!cells || cells.length===0)?"full-scan-display-wrap ":"")}>
						<div ref={this.scanDisplay} className="scan-display" style={{transform: "translateY("+positionOffset+"px ) rotate("+rotationOffset+"deg)"}}>
							{this.state.scanUrl?scan:""}
							<div className="detected-table-cells-wrap">
								{cellsOverlay}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

