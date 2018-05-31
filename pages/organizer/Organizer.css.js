import css from 'styled-jsx/css'
export default css
`
	.page-wrap{
		height:100vh;
		display: flex;
		flex-direction: column;
		background: #fbfbfb;
	}
	.wrapper{
		display: flex;
		flex-direction: row;
		height: calc(100% - 55px);
	}
	.left-panel{
		width: 20%;
		padding: 1%;
		box-sizing: border-box;
		background-color: #fbfbfb;
		text-align: center;
	}
	.main-panel{
		width: 80%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}
	.results-wrap{
		overflow: auto;
		padding: 2.5%;
		position: relative;
	}
	.query-results{
		width: 95%;
	}
`