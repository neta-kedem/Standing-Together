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
		line-height: 0.75em;
		margin-top: 2em;
	}
	.code-input-title{
		text-align: center;
		font-size: 1.25em;
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
