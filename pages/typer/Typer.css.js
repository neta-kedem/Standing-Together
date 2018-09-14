import css from 'styled-jsx/css'
export default css
`
	.content{
		height: 100%;
		padding: 20px;
		padding-top: 40px;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		-ms-flex: 1;
		flex: 1;
		border-style: none solid solid;
		border-width: 1px;
		border-color: rgba(86, 95, 108, .3);
		background-image: linear-gradient(180deg, #eaeaea, #eaeaea);
	}
	.main-panel{
		display: flex;
		height: 100%;
		min-height: calc(100vh - 55px);
		float: none;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-webkit-flex-direction: column;
		-ms-flex-direction: column;
		flex-direction: column;
	}
	.section{
		width: 100%;
		height: 100%;
	}
	.row{
		display: block;
		-webkit-box-pack: center;
		-webkit-justify-content: center;
		ms-flex-pack: center;
		border-collapse: collapse;
		justifyc-ontent: center;
	}
	.info_table{
		display: flex;
		padding: 0;
		justify-content: center;
		width: 100%;
		border-collapse: collapse;
		font-size:16px;
	}
	.heading{
		margin-top: 0px;
		padding-left: 5px;
		color: rgba(86, 95, 108, .7);
		font-weight: 700;
		line-height: 24px;
		text-transform: uppercase;
	}
	.save-btn{
		position: absolute;
		text-align: right;
		font-family: 'Fa solid 900', sans-serif;
		color: rgba(86, 95, 108, .9);
		font-size: 14px;
		justify-content: right;
		right: 255px;
		padding-top: 10px;
		cursor: pointer;
	}
	.save-div{
		text-align: right;
		justify-content: right;
		padding-bottom: 10px;
		top: 0px;
	}
`
