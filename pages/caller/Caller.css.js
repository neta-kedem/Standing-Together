import css from 'styled-jsx/css'
export default css
`
	/* width */
	::-webkit-scrollbar {
		width: 5px;
	}
	
	/* Track */
	::-webkit-scrollbar-track {
		background: rgb(169,169,169); 
	}
	
	/* Handle */
	::-webkit-scrollbar-thumb {
		background:rgba(86, 95, 108, .9); 
	}
	
	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: rgba(86, 95, 108, .9); 
	}
	.content-wrap{
		display: flex;
		flex-direction: row;
		height: calc(100% - 55px);
		background-color: #EBEBE8;
	}
	.right-panel{
		width: 50%;
		padding: 2%;
		padding-left: 0;
		box-sizing: border-box;
	}
	.caller-action{
		color: #616B6F;
		font-weight: bold;
		margin-bottom: 5%;
	}
	.caller-action-col{
		display: inline-block;
		vertical-align: middle;
		line-height: 1.5em;
		box-sizing: border-box;
		margin-left: 2.5em;
	}
	.label-text{
		margin-left: 0.5em;
		display: inline-block;
		vertical-align: middle;
	}
	.label-icon{
		margin-left: 0.5em;
		font-size: 1.5em;
		display: inline-block;
		vertical-align: middle;
	}
	.call-outcomes{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: #616B6F;
		font-weight: bold;
	}
	.call-outcome-button{
		box-sizing: border-box;
	}
	.left-panel{
		width: 50%;
		padding: 2%;
		box-sizing: border-box;
	}
	.left-panel textarea{
		width: 100%;
		height: 30%;
		padding: 1em;
		box-sizing: border-box;
		resize: none;
	}
`