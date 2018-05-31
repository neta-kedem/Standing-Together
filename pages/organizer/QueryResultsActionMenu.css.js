import css from 'styled-jsx/css'
export default css`
	.query-results-wrapper{
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		height: 50px;
		flex: 0 0 auto;
		background-color: #fbfbfb;
	}
	.results-count{
		display: inline-block;
		padding: 16px 20px;
		color: rgba(86, 95, 108, 0.9);
		font-size: 24px;
		line-height: 24px;
		font-weight: 700;
		text-align: center;
	}
	.action-button{
		margin: 7.5px 10px;
		padding: 6px 12px 0px 10px;
		color: rgb(100, 109, 114);
		font-size: 20px;
		font-weight: 500;
		text-align: center;
	}
	.action-button.align-to-end{
		margin-left: auto;
	}
	.action-button-icon{
		font-size: 14px;
	}
`