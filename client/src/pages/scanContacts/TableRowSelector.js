import React from 'react';
import Stylesheet from './TableRowSelector.scss'
//graphics

export default class TableRowSelector extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		src: props.src,
		width: props.width,
		height: props.height,
		cells: props.cells,
		emptyRows: [],
		titleRow: true,
		onSelection: props.onSelection
	};
}

handleRowClick(rowIndex){
	let emptyRows = this.state.emptyRows.slice();
	let titleRow = this.state.titleRow;
	const rowCount = this.state.cells.length;
	//toggle title
	if(rowIndex === 0)
	{
		titleRow=!titleRow;
		this.setState({"titleRow": titleRow});
	}
	//otherwise, if there are no rows flagged as empty yet
	else if(emptyRows.length === 0)
	{
		for(let i = rowIndex; i<rowCount; i++)
		{
			emptyRows.push(i);
		}
		this.setState({"emptyRows": emptyRows});
	}
	//if there are  already some rows flagged as empty, toggle the 'empty' flag for the clicked row only
	else if(emptyRows.indexOf(rowIndex)=== -1)
	{
		emptyRows.push(rowIndex);
	}
	else
	{
		emptyRows.splice(emptyRows.indexOf(rowIndex), 1);
	}
	this.setState({"emptyRows": emptyRows});
	const cells = this.state.cells;
	let selectedCells = [];
	for(let i = titleRow ? 1 : 0; i<cells.length; i++){
		if(emptyRows.indexOf(i) === -1){
			selectedCells.push(cells[i]);
		}
	}
	this.state.onSelection(selectedCells);
}
render() {
	//initialize layout dimensions - if the relevant variables aren't available yet, use an arbitrary default
	//width percentage - 100 divided by the width of the canvas
	const wp = this.state.width?100/this.state.width:0.1;
	//height percentage - 100 divided by the height of the canvas
	const hp = this.state.height?100/this.state.height:0.1;
	const hoverableCells = this.state.cells.map((row, i)=>{
		//construct class name for the cell
		let className = "detected-table-row "+
		//check if the cell is in the first row, and whether the first row is a title row, add class appropriately
		((i === 0&&this.state.titleRow)?"title-row ":"")+
		//check if the row was indicated as empty
		(this.state.emptyRows.indexOf(i)!== -1?"empty-row ":"");
		let rowCells = row.map((cell, j)=>{
			return <div className="detected-table-cell"
						onClick={() => this.handleRowClick(i)}
						key={j}
						style={{
							...{
								clipPath: "polygon(" +
									cell[0].x * wp + "% " + cell[0].y * hp + "%, " +
									cell[1].x * wp + "% " + cell[1].y * hp + "%, " +
									cell[2].x * wp + "% " + cell[2].y * hp + "%, " +
									cell[3].x * wp + "% " + cell[3].y * hp + "%" +
									")"
							}, ...{animationDelay: (i + j) * 0.05 + "s"}
						}}
			> </div>;
		});
		return <div className={className}
					onClick={() => this.handleRowClick(i)}
					key={i}>{rowCells}</div>;
	});
	
	return (
		<div>

			<div className="display-wrap">
				<img src={this.state.src?this.state.src:undefined} alt="scanned document" className="scan-canvas"/>
				<div className="detected-table-cells-wrap">
					{hoverableCells}
				</div>
			</div>
		</div>
	)
}

}