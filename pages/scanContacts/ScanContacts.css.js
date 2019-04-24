import css from 'styled-jsx/css'
export default css
`
.hidden{
    display: none;
}
.scan-page-title-wrap{
	width: 100%;
}
.scan-page-title{
	text-align: right;
	margin-right: 0.5em;
	color: white;
}
.page-wrap{
	height: calc(100vh - 55px);
	width: 100%;
	position: relative;
}
.contact-scan-step-wrap{
	width: 90%;
	margin: 0 auto 5% auto;
}
.contact-scan-step-title{
	direction: rtl;
	text-align: center;
	margin: 2.5%;
	color: #90278e;
	font-weight: bold;
}
.contact-scan-uploader{
	margin: 5% auto;
	text-align: center;
}
.img-preview{
    width: 80%;
    display: block;
    margin: 0 auto;
}
.post-scan-button{
	color: white;
	background-color: #90278e;
	border: none;
	outline: none;
	font-size: 1.5em;
	display: block;
	padding: 0.25em 0.5em;
	margin: 0.5em auto;
	transition: background-color 0.25s;
	cursor: pointer;
}
.post-scan-button:hover{
	background-color: #731f72;
}
.post-scan-button:active{
	background-color: #561755;
}
.failed-scan-popup{
	text-align: center;
}
.failed-scan-popup-label{
	margin-bottom: 5%;
}
.failed-scan-button{
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
.failed-scan-button:hover{
	background-color: #731f72;
}
.failed-scan-button:active{
	background-color: #561755;
}
.rotation-controls button{
    cursor: pointer;
    color: white;
    font-size: 2em;
    font-weight: bold;
    width: 1.5em;
    height: 1.5em;
    margin: 2%;
	background-color: #90278e;
	border: none;
	outline: none;
	transition: background-color 0.25s;
}
.rotation-controls button:hover{
	background-color: #731f72;
}
.rotation-controls button:active{
	background-color: #561755;
}
`
