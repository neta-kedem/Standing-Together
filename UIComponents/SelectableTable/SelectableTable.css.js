import css from 'styled-jsx/css'
export default css`
	.list-table{
		width: 100%;
		border-collapse: collapse;
		font-size:16px;
	}
	.list-table-header{
		color: #90959e;
		font-weight: 700;
		font-size:14px;
		margin: 0 auto;
		width: 100%;
		text-align: left;
	}
	.list-table-header-field{
		padding-bottom: 5px;
	}
	.list-table-header-field.hidden{
		display: none;
	}
	.list-table-row{
		background-color:#fff;
		white-space: nowrap;
		transition: background-color 1.5s;
	}
	.selected-table-row{
		background-color:#FF4C94;
	}
	.list-table-row:hover{
		background-color: #fafafa;
		transition: background-color 0.5s;
	}
	.list-table-field{
		border:1px solid rgb(202, 200, 199);
		height: 1.5em;
		color: rgb(103, 111, 117);
	}
	.list-table-field.hidden{
		display: none;
	}
	.list-row-selection-indicator{
		width: 0px;
	}
	.select-all-checkbox{
		color: rgb(128, 134, 138);
		font-weight: 700;
	}
	.checkbox{
		display: inline-block;
		margin-right: 10px;
		color: rgba(86, 95, 108, .7);
	}
	.checkbox-checked{
		color: #FF4C94;
	}
`