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
		min-height: calc(100% - 55px);
		background-color: #EBEBE8;
		position: relative;
	}
	.right-panel{
		width: 50%;
		padding: 5% 10% 5% 0%;
		padding-left: 0;
		box-sizing: border-box;
	}
	.fetch-more-button{
		cursor: pointer;
		text-align: center;
		color: #616B6F;
		font-weight: bold;
		margin-bottom: 5%;
	}
	.fetch-more-button .label-icon{
		transition: color 0.25s;
	}
	.fetch-more-button:hover .label-icon{
		color: #09a;
	}
	.caller-action{
		color: #616B6F;
		font-weight: bold;
		margin-bottom: 5%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.caller-action-col{
		vertical-align: middle;
		line-height: 1.5em;
		box-sizing: border-box;
	}
	.call-question{
		width: 50%;
	}
	.copy-text-button{
		cursor: pointer;
	}
	.copy-text-button .label-icon{
		transition: color 0.25s;
	}
	.copy-text-button:hover .label-icon{
		color: #90278e;
	}
	.label-text{
		text-align: center;
		display: block;
		margin: 0 auto;
		vertical-align: middle;
	}
	.label-icon{
		font-size: 1.5em;
		display: block;
		margin: 0 auto;
	}
	.inline-label .label-icon, .inline-label .label-text{
		display: inline-block;
		vertical-align: middle;
	}
	.inline-label .label-text{
		margin-left: 0.5em;
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
		cursor: pointer;
		transition: color 0.25s;
	}
	.remove-contact:hover{
		color: #a00;
	}
	.availability-timer{
		border: none;
		border-bottom: 2px solid #616B6F;
		background-color: transparent;
		font-size: 1.25em;
		text-align: center;
		width: 4em;
		height: 1.33em;
		display: block;
		margin: 0 auto;
		outline: none;
	}
	.availability-timer .time-passed{
		border-color: green;
	}
	.availability-timer .time-not-passed{
		border-color: #a00;
	}
	.finish-call:hover{
		color: #90278e;
	}
	.left-panel{
		width: 50%;
		padding: 5%;
		padding-left: 10%;
		box-sizing: border-box;
	}
	.script-title{
		padding-top: 5px;
		padding-bottom: 7px;
		color: #616B6F;
		font-weight: bold;
		font-size: 14px;
	}
	.left-panel textarea{
		width: 100%;
		height: 30%;
		padding: 1em;
		box-sizing: border-box;
		resize: none;
	}
`