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
	input{
		font-family: Cabin, sans-serif !important;
	}
	::placeholder {
		color: var(--field-placeholder-color);
		direction: rtl;
	}
	:-ms-input-placeholder {
		color: var(--field-placeholder-color);
		direction: rtl;
	}
	::-ms-input-placeholder {
		color: var(--field-placeholder-color);
		direction: rtl;
	}
`
