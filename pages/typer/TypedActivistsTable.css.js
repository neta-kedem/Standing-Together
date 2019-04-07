import css from 'styled-jsx/css'
export default css`
	.typed-table-wrap{
		display: block;
		width: fit-content;
		margin: 0 auto;
	}
	.typed-rows-table{
		border-collapse: collapse;
	}
	.typed-rows-table thead tr{
		border: none;
		background-color: transparent;
		color: rgba(86, 95, 108, 1);
	}
	.typed-rows-table tr, .typed-rows-table td{
		border: 1px solid rgb(202, 200, 199);
		padding: 0px
	}
	.typed-rows-table input{
		border: none;
		background-color: transparent;
		outline: none;
		margin: 0;
		padding: 5px;
	}
	.typed-rows-table input:disabled{
	    background-color: #DDD;
	    color: #555;
	}
	.typed-rows-table tr{
		transition: background-color 0.25s ease-in-out;
		background-color: rgb(247, 245, 246);
	}
	.typed-rows-table tr:focus-within{
		background-color: #fffa;
	}
	.typed-rows-table .row-margin, .typed-rows-table .row-margin td{
		border: none;
		display: none;
	}
	.typed-rows-table .row-margin{
		height: 0px;
		opacity: 0;
	}
	.typed-rows-table .row-wrap:focus-within .row-margin{
		display: table-row;
		height: 5px;
	}
	.typed-rows-table .row-wrap:first-of-type .row-margin:first-child{
		height: 0px !important;
	}
	
	.typed-rows-table .delete-row-wrap{
		background-color: transparent;
		width: 0px;
		height: 0px;
		border: none;
		overflow: visible;
		position: relative;
		padding: 0px;
	}
	.delete-row{
		display: none;
		position: absolute;
		color: rgba(86, 95, 108, .7);
		padding-left: 2em;
		right: -2em;
		top: 0.4em;
		bottom: 0;
		cursor: pointer;
	}
	.typed-rows-table  .row-wrap:hover .delete-row-wrap .delete-row, .typed-rows-table  .row-wrap:focus-within .delete-row-wrap .delete-row{
		display: block;
	}
	.delete-row:hover{
		color: rgba(86,95,108,1);
	}
	.delete-row:active{
		color: #444;
	}
	.highlight-invalid-fields .invalid{
        background-color: rgb(255, 150, 160);
    }
`