import css from 'styled-jsx/css'
export default css
    `
    .title-wrap{
		color: #fbfbfb;
		font-size: 21px;
		font-weight: 400;
		line-height: 55px;
		text-align: center;
		margin: 0 auto;
	}
	.title-lang{
        margin-left: 5%;
		white-space: nowrap;
	}
    .circle-table{
        direction: rtl;
        border-collapse: collapse;
        margin: 5% auto;
        width: 80%;
        table-layout: fixed;
    }
    .circle-table th{
        padding: 5px 15px;
        border: 1px solid black;
    }
    .circle-table td{
        padding: 0px;
        border: 1px solid black;
    }
    .circle-table td input, .circle-table td select{
        width: 100%;
        box-sizing: border-box;
        border: none;
        outline: none;
    }
    .circle-table tbody{
        cursor: pointer;
    }
    .add-circle-button, .save-circles-button{
        display: block;
        margin: 0 auto;
        padding: 1% 3%;
        font-size: 1.5em;
        color: white;
        background-color: #90278e;
        border: none;
        outline: none;
    }
    .save-circles-button{
        margin-top: 5%;
    }
    .add-circle-button:hover, .save-circles-button:hover{
        background-color: #80177e;
    }
    .add-circle-button:active, .save-circles-button:active{
        background-color: #70076e;
    }
`
