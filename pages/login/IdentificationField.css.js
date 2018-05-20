import css from 'styled-jsx/css'
export default css`
	.credentials-field-wrap{
		position: relative;
		width: 14em;
		display: block;
		margin: 0 auto;
		margin-top: 1em;
		white-space: nowrap;
	}
	.credentials-field{
		display: inline-block;
		position: relative;
		height: 2em;
		width: 100%;
		box-sizing: border-box;
		padding: 0.125em 0.5em;
		font-size: 1.25em;
		border-radius: 0.2em;
		background-color: #FFF;
		line-height: 2em;
		text-align: right;
		border: none;
		outline: none;
		z-index: 2;
	}
	.login-button-wrap{
		transition: width 1s;
		display: inline-block;
		overflow: hidden;
		position: absolute;
		right: calc(100% - 0.2em);
		background: #DDD;
		border-radius: 0.2em 0 0 .2em;
	}
	.login-button{
		height: 2em;
		width: 100%;
		box-sizing: border-box;
		padding: 0.125em 0.5em;
		font-size: 1.25em;
		outline: none;
		border: none;
		top: 0;
		cursor: pointer;
	}
	.login-button-icon{
		color: #4c5b6d;
		width: 100%;
		height: 100%;
	}
	.valid-input{
		width:2.5em;
	}
	.invalid-input{
		width:0;
	}
`