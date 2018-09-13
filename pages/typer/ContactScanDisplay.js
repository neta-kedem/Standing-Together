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
		}
	};
	componentWillReceiveProps(nextProps) {
		// You don't have to do this check first, but it can help prevent an unneeded render
		if (nextProps.scanUrl && !this.state.scanUrl) {
			this.setState({scanUrl: nextProps.scanUrl});
		}
		if (nextProps.cells) {
			this.setState({cells: nextProps.cells});
		}
		if (nextProps.selectedRow && this.state.selectedRow!=nextProps.selectedRow) {
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
		const scan = <img src={"../uploads/contactScans/"+this.state.scanUrl} className="scan-canvas" onLoad={this.handleImageLoaded.bind(this)}/>
		//width perecentage - 100 divided by the width of the canvas
		const wp = this.state.scanWidth?100/this.state.scanWidth:0.1;
		//height perecentage - 100 divided by the height of the canvas
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
				></div>;
			});
				return <div className={"detected-table-row "+(i==selectedRow?"selected-table-row ":"")} key={i}>{cells}</div>;
		});
		//calculate the direction of the selected row, in order to even out the image horizontally
		let rotationOffset = 0;
		let positionOffset = 0;
		if(cells.length>0)
		{
			const selectedX1 = cells[selectedRow].cells[0].corners[0].x;
			const selectedX2 = cells[selectedRow].cells[cells[selectedRow].cells.length-1].corners[0].x;
			const selectedY1 = cells[selectedRow].cells[0].corners[0].y;
			const selectedY2 = cells[selectedRow].cells[cells[selectedRow].cells.length-1].corners[0].y;
			rotationOffset = -Math.atan((selectedY1-selectedY2)/(selectedX1-selectedX2))/Math.PI*180;
			positionOffset = -((selectedY1+selectedY2)/2) - Math.abs(selectedY1 - selectedY2)/4;
		}
		return (
			<div>
				<style jsx global>{style}</style>
				<div className="scan-wrap">
					<div className="row-nav-wrap">
						<button className="row-nav row-nav-up" onClick={() => this.selectScanRow(selectedRow-1)}>
							<FontAwesomeIcon icon="chevron-up"/>
						</button>
						<button className="row-nav row-nav-down" onClick={() => this.selectScanRow(selectedRow+1)}>
							<FontAwesomeIcon icon="chevron-down"/>
						</button>
					</div>
					<div className="scan-display-wrap">
						<div className="scan-display" style={{transform: "translateY(calc("+positionOffset+" * 0.19% + 30px)) rotate("+rotationOffset+"deg)"}}>
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

