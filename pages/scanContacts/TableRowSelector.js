import React from 'react';
import Stylesheet from './TableRowSelector.css'

//graphics
import ia from '../../services/canvas/imageAdjustor';

export default class TableRowSelector extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		src: props.src,
		width: props.width,
		height: props.height,
		cells: props.cells,
		emptyRows: [],
		titleRow: true
	};
}

handleRowClick(rowIndex){
	let emptyRows = this.state.emptyRows.slice();
	let titleRow = this.state.titleRow;
	const rowCount = this.state.cells.length;
	//toggle title
	if(rowIndex==0)
	{
		this.setState({"titleRow": !titleRow});
		return;
	}
	//otherwise, if there are no rows flagged as empty yet
	if(emptyRows.length==0)
	{
		for(let i = rowIndex; i<rowCount; i++)
		{
			emptyRows.push(i);
		}
		this.setState({"emptyRows": emptyRows});
		return;
	}
	//if there are  already some rows flagged as empty, toggle the 'empty' flag for the clicked row only
	if(emptyRows.indexOf(rowIndex)==-1)
	{
		emptyRows.push(rowIndex);
	}
	else
	{
		emptyRows.splice(emptyRows.indexOf(rowIndex), 1);
	}
	this.setState({"emptyRows": emptyRows});
	return;
}
render() {
	//initilaize layout dimensions - if the relevant variables aren't available yet, use an arbitrary default
	//width perecentage - 100 divided by the width of the canvas
	const wp = this.state.width?100/this.state.width:0.1;
	//height perecentage - 100 divided by the height of the canvas
	const hp = this.state.height?100/this.state.height:0.1;
	const hoverableCells = this.state.cells.map((row, i)=>{
		//construct class name for the cell
		let className = "detected-table-row "+
		//check if the cell is in the first row, and whether the first row is a title row, add class appropriately
		((i==0&&this.state.titleRow)?"title-row ":"")+
		//check if the row was indicated as empty
		(this.state.emptyRows.indexOf(i)!=-1?"empty-row ":"");
		let rowCells = row.map((cell, j)=>{
			let cellDOM =
				<div className="detected-table-cell"
					onClick={() => this.handleRowClick(i)}
					key={j}
					style={{...{clipPath: "polygon("+
						cell[0].x*wp+"% "+cell[0].y*hp+"%, "+
						cell[1].x*wp+"% "+cell[1].y*hp+"%, "+
						cell[2].x*wp+"% "+cell[2].y*hp+"%, "+
						cell[3].x*wp+"% "+cell[3].y*hp+"%"+
					")"},...{animationDelay: (i+j)*0.05+"s"}}}
				></div>;
			return cellDOM;
		});
		let rowDOM =
			<div className={className}
				onClick={() => this.handleRowClick(i)}
				key={i}
			>{rowCells}</div>
		return rowDOM;
	});
	
	return (
		<div>
			<style jsx global>{Stylesheet}</style>
			<div className="display-wrap">
				<img src={this.state.src?this.state.src:undefined} className="scan-canvas"/>
				<div className="detected-table-cells-wrap">
					{hoverableCells}
				</div>
			</div>
		</div>
	)
}

}