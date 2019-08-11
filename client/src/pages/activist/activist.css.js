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
	    float: left;
        left: 0;
        position: absolute;
        justify-self: start;
        -webkit-align-self: right; /* Safari 7.0+ */
        align-self: right;
        height: 100%;
        padding: calc(25px - 1em) 1.25em;
        box-sizing: border-box;
		color: white;
		display: inline-block;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	.save-event-button:hover{
        background-color: #00000033;
        color: #eee;
    }
    .save-event-button:active{
        background-color: #00000066;
        color: #bbb;
    }
	.save-event-button-label{
		display: inline-block;
		vertical-align: middle;
		line-height: 1em;
	}
	.save-event-button-icon{
		display: inline-block;
		vertical-align: middle;
		font-size: 2em;
		margin-right: 0.5em;
	}
`