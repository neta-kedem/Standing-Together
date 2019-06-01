import css from 'styled-jsx/css'
export default css
`
	.content{
	    overflow: auto;
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
	.fully-typed-popup-label div{
	    text-align: center;
	}
	.toggle-fully-typed{
	    width: 100px;
	    height: 50px;
	    display: inline-block;
	}
	.confirm-fully-typed-wrap{
	    margin-top: 1em;
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
	}
	.confirm-fully-typed{
	    width: 15em;
	    padding: 0.25em;
	    margin: 0.5em;
        color: white;
        background-color: #90278e;
        border: none;
        outline: none;
        font-size: 1.5em;
        display: inline-block;
        padding: 0.25em 0.5em;
        transition: background-color 0.25s;
        cursor: pointer;
    }
    .confirm-fully-typed:hover{
    	background-color: #731f72;
    }
    .confirm-fully-typed:active{
    	background-color: #561755;
    }
	.event-details{
	    display: block;
        color: #fbfbfb;
        font-size: 1.5em;
        font-weight: 400;
        text-align: center;
        margin: 5%;
    }
    .post-button{
        justify-self: start;
        margin-left: 0.5em;
        -webkit-align-self: right; /* Safari 7.0+ */
        align-self: right;
        color: #fbfbfb;
        font-size: 1.5em;
        font-weight: 400;
        cursor: pointer;
    }
    .post-button-label{
        display: inline-block;
        line-height: 1em;
        vertical-align: middle;
    }
    .cloud-icon{
        display: inline-block;
        font-size: 1.75em;
        margin-left: 0.3em;
        text-align: center;
        vertical-align: middle;
    }
    .scan-uploader-form-wrap{
        direction: ltr;
    }
    .scan-uploader-message{
        text-align: center;
    }
`
