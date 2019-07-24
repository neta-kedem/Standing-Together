import css from 'styled-jsx/css'
export default css`
	.typed-table-wrap{
		display: block;
		width: fit-content;
		margin: 0 auto;
		margin-bottom: 2.5%;
	}
	.typed-rows-table{
		border-collapse: collapse;
	}
	.typed-rows-table thead{
	    display: block;
	}
	.typed-rows-table thead tr{
		border: none;
		background-color: transparent;
		color: rgba(86, 95, 108, 1);
	}
	.typed-rows-table.main-body{
	    height: calc(90vh - 300px - 6em);
        overflow-y: auto;
	    display: block;
	}
	.typed-rows-table input{
		border: none;
		background-color: transparent;
		outline: none;
		margin: 0;
		padding: 5px;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}
	.typed-rows-table input:disabled{
	    background-color: #DDD;
	    color: #555;
	}
	.typed-rows-table td, .typed-rows-table th{
	    width: 10em;
	}
	.typed-rows-table td{
	    border: 1px solid rgb(202, 200, 199);
		padding: 0px !important;
		transition: background-color 0.25s ease-in-out;
		background-color: rgb(247, 245, 246);
	}
	.typed-rows-table tr:focus-within td{
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
	.typed-rows-table .col-margin{
		width: 5px;
		display: block;
		opacity: 0;
	}
	
	.typed-rows-table .delete-row-wrap{
		background-color: transparent;
		width: 2em;
		height: 0px;
		border: none;
		overflow: visible;
		position: relative;
		padding: 0px;
		cursor: pointer;
		overflow: hidden;
	}
	.delete-row{
		display: none;
		position: absolute;
		color: rgba(86, 95, 108, .7);
		padding-left: 2em;
		right: 0;
		top: 0.4em;
		bottom: 0;
	}
	.typed-rows-table .row-wrap:hover .delete-row-wrap .delete-row, .typed-rows-table  .row-wrap:focus-within .delete-row-wrap .delete-row{
		display: block;
	}
	.delete-row-wrap:hover .delete-row{
		color: rgba(86,95,108,1);
	}
	.delete-row-wrap:active .delete-row{
		color: #444;
	}
	.highlight-invalid-fields .invalid{
        background-color: rgb(255, 150, 160);
    }
`