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
.main-content{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    padding: 0 1em;
    height: 100%;
    overflow: auto;
}
.import-excel-wrap{
    width: 60%;
    text-align: center;
}
.event-selection-wrap{
    width: 30%;
    text-align: center;
}
.contact-scan-uploader{
	margin: 5% auto;
	text-align: center;
}
.post-scan-wrap{
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
	height: 4em;
    width: 100%;
	background-color: #90278e;
	overflow: hidden;
	transition: transform 0.5s ease-out;
	transform: TranslateY(4em);
}
.post-scan-wrap.active{
	transform: TranslateY(0);
    box-shadow: rgba(0, 0, 0, 0.6) 0px 0px 5px;
}
.post-scan-button{
	color: #731f72;
	background-color: white;
	border: none;
	outline: none;
	font-size: 1.5em;
	display: block;
	padding: 0.25em 1em;
	margin: 0.5em auto;
	transition: background-color 0.25s, box-shadow 0.3s;
	cursor: pointer;
}
.post-scan-button:hover{
	background-color: #eee;
	box-shadow: 0.05em 0.05em 0.3em #00000050 inset;
}
.post-scan-button:active{
	background-color: #ddd;
	box-shadow: 0.05em 0.05em 0.3em #00000070 inset;
}
.contacts-table{
    border-collapse: collapse;
    display: block;
    margin: 0 auto;
    width: 100%;
}
.contacts-table td, .contacts-table tr, .contacts-table th{
    border: 1px solid black;
}
.contacts-table input{
    border: none;
    outline: none;
    margin: none;
    width: 100%;
    height: 100%;
    background-color: transparent;
    padding: 2px 0.3em;
    box-sizing: border-box;
}
`
