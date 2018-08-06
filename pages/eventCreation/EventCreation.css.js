export default 
`
	/*Scroll Bar*/
	::-webkit-scrollbar {
		width: 6px;
	}
	/* Track */
	::-webkit-scrollbar-track {
		background: #999; 
	}
	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #4D4D4D; 
	}
	
	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #555; 
	}
	.inputGroup{
		white-space: nowrap;
		width: 100%;
		display: flex;
		flex-direction: row;
	}
	.inputGroup label{
		margin-left: 1em;
	}
	.inputGroup label:last-child{
		margin-left: 0;
	}
	.inputGroup label div{
		margin-left: 0.5em;
	}
	label{
		color: #4D4D4D;
		vertical-align: middle;
		display: flex;
		flex-direction: column;
		margin: 1em 0;
	}
	label div{
		margin-bottom: 0.5em;
		margin-left: 2em;
		white-space: nowrap;
		align-self: center;
		line-height: 1.2em;
		color: #90969E;
		font-weight: bold;
	}
	
	label.inline-label{
		flex-direction: row;
	}
	textarea, input{
		resize: none;
		background-color: white;
		color: #4D4D4D;
		outline: none;
		width: 100%;
		height: 100%;
		padding: 0.5em;
		box-sizing: border-box;
		border: 1px solid #AEB3B9;
		font-size: 1em;
	}
	body{
		background-color: #F9F9F9;
	}
	.content-wrap{
		height: calc(100vh - 55px);
		padding: 4em 8em;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		overflow-y: auto;
	}
	.event-details-wrap{
		box-sizing: border-box;
		width: 50%;
		padding-left: 5em;
		vertical-align: top;
	}
	.event-details-wrap input{
		text-align:center;
		padding: 0.25em;
		box-sizing: border-box;
	}
	#event-name{
		width: 60%;
	}
	#event-date{
		width: 40%;
	}
	.event-identification{
		height:4em;
	}
	.event-question{
		height: 3em;
	}
	.event-text{
		height: 13em;
	}
	.event-script-wrap{
		display: flex;
		flex-direction: column;
		width:50%;
		height: 28.75em;
		vertical-align: top;
	}
	.event-script-wrap label{
		height: 100%;
	}
	.event-script-wrap textarea{
		height: 100%;
		width: 100%;
		padding: 0.5em;
		border: none;
		overflow-y: scroll;
	}
	.save-event-button{
		color: white;
		display: inline-block;
		cursor: pointer;
		margin-left: auto;
	}
	.save-event-button-label{
		display: inline-block;
		vertical-align: middle;
	}
	.save-event-button-icon{
		display: inline-block;
		vertical-align: middle;
		font-size: 2em;
		margin: 0 0.5em;
	}
`
