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
	label{
		color: #4D4D4D;
		width: 100%;
		vertical-align: middle;
		display: flex;
		flex-direction: column;
	}
	label div{
		margin-bottom: 0.25em;
		white-space: nowrap;
		margin-left: 0.25em;
		align-self: center;
		line-height: 0.8em;
		color: #90969E;
	}
	
	label.inline-label{
		flex-direction: row;
	}
	textarea, input{
		resize: none;
		background-color: white;
		color: #4D4D4D;
		border: 1px solid #AEB3B9;
		outline: none;
		width: 100%;
		height: 100%;
		padding: 0.5em;
		box-sizing: border-box;
		font-size: 1em;
	}
	.page-wrap{
		padding: 5%;
		background-color: #F9F9F9;
		height: calc(100% - 55px);
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
	}
	.event-details-wrap{
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		width:50%;
		height: 100%;
		padding-left: 5%;
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
		height:10%;
	}
	.event-question{
		height: 15%;
	}
	.event-text{
		height: 30%;
	}
	.event-script-wrap{
		display: flex;
		flex-direction: column;
		width:50%;
		height: 100%;
		vertical-align: top;
	}
	.event-script-wrap label{
		height: 100%;
	}
	.event-script-wrap textarea{
		height: 100%;
		width: 100%;
		padding: 2em;
	}
	
`
