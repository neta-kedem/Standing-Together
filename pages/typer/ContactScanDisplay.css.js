import css from 'styled-jsx/css'
export default css
`
	.scan-wrap{
		display: flex;
		flex-direction: row;
		background-color: #90278e;
	}
	.row-nav-wrap{
		width: 10%;
	}
	.row-nav{
		display: block;
		width: 100%;
		height: 50%;
		border: none;
		outline: none;
		color: white;
		background-color: rgba(0, 0, 0, 0);
		cursor: pointer;
	}
	.row-nav:hover{
		background-color: rgba(0, 0, 0, 0.2);
	}
	.row-nav:active{
		background-color: rgba(0, 0, 0, 0.4);
	}
	.scan-display-wrap{
		width: 90%;
		height: 60px;
		overflow: hidden;
	}
	.scan-display{
		position: relative;
		display: block;
		margin: 0 auto;
		width: 80%;
		transition: transform 0.5s;
	}
	.scan-canvas{
		width: 100%;
	}
	.detected-table-cells-wrap{
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		bottom: 0;
	}
	.detected-table-cell{
		background-color: #000;
		opacity: 0.7;
		position: absolute;
		width: 100%;
		height: 100%;
		transition: opacity 0.25s;
	}
	.detected-table-row.selected-table-row .detected-table-cell{
		opacity: 0;
	}
	.detected-table-row:hover .detected-table-cell{
		opacity: 0;
	}
`
