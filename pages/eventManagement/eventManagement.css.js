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
    .event-table{
        direction: rtl;
        border-collapse: collapse;
        margin: 5% auto;
        width: 80%;
    }
    .event-table td, .event-table th{
        padding: 5px 15px;
        border: 1px solid black;
    }
    .event-table tbody{
        cursor: pointer;
    }
    .event-table tbody tr:hover{
        background-color: #EEE;
    }
    .event-table tbody tr:active{
        background-color: #DDD;
    }
`
