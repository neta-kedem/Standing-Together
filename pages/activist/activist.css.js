import css from 'styled-jsx/css'
export default css
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
	.contact-form-wrap{
	    width: 100%;
	    height: max-content;
	    padding-bottom: 3em;
	    border-bottom: 2px solid #888;
	    display: flex;
	    flex-direction: row;
	    flex-wrap: wrap;
	}
	label{
	    width: 45%;
	    height: 3em;
		color: #4D4D4D;
		margin-left: 2.5%;
		margin-top: 1.5em;
	}
	label div{
		margin-bottom: 0.5em;
		margin-left: 2em;
		white-space: nowrap;
		align-self: right;
		line-height: 1.2em;
		color: #60666E;
		font-weight: bold;
	}
	label.inline-label{
		flex-direction: row;
	}
	textarea, input, select{
		resize: none;
		background-color: white;
		color: #4D4D4D;
		outline: none;
		width: 100%;
		height: 1.5em;
		padding: 0.5em;
		box-sizing: border-box;
		border: 1px solid #AEB3B9;
		font-size: 1em;
	}
	select{
	    padding: 0;
	}
	.checkbox-label{
	    width: 25%;
	    height: 1.5em;
	}
	.checkbox-label div{
	    display: inline-block;
	    line-height: 1.5em;
	}
	input[type='checkbox']{
	    width: 1.5em;
	    display: inline-block;
	    vertical-align: middle;
	}
	body{
		background-color: #F9F9F9;
	}
	.content-wrap{
		height: calc(100vh - 55px);
		padding: 2em 4em;
		box-sizing: border-box;
		overflow-y: auto;
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
