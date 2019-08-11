import css from 'styled-jsx/css'
export default css`
	:root {
		--field-placeholder-color: #777F89;
		--background-color: #90278e;
		--main-color: #fff;
	}
	.logo{
		display: block;
		width: 35%;
		margin: 0 auto;
		margin-top: 6%;
	}
	.login-page-wrap{
		direction: rtl;
	}
	.identification-input-title{
		text-align: center;
		font-size: 1.25em;
		margin-top: 2em;
	}
	.code-input-title{
		text-align: center;
		font-size: 1.25em;
	}
	.login-code{
		display: block;
		margin: 0 auto;
		height: 2em;
		width: 12em
		box-sizing: border-box;
		padding: 0.125em 0.5em;
		font-size: 1.25em;
		letter-spacing: 0.25em;
		border-radius: 0.2em;
		background-color: #FFF;
		line-height: 2em;
		text-align: left;
		direction: ltr;
		border: none;
		outline: none;
		z-index: 2;
	}
	.back-to-identification{
	    cursor: pointer;
	    margin: 1% auto;
	    text-align: center;
	}
	body{
		color: var(--main-color);
		background-color: var(--background-color);
		direction: rtl;
		text-align: right;
	}
	::placeholder {
		color: var(--field-placeholder-color);
		direction: ltr;
		text-align: center;
	}
	:-ms-input-placeholder {
		color: var(--field-placeholder-color);
		direction: ltr;
		text-align: center;
	}
	::-ms-input-placeholder {
		color: var(--field-placeholder-color);
		direction: ltr;
		text-align: center;
	}
`