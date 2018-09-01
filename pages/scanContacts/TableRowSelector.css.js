import css from 'styled-jsx/css'
export default css
`
.display-wrap{
	position: relative;
	display: block;
	margin: 0 auto;
	width: 80%;
}
.scan-canvas{
	width: 100%;
}
.detected-table-cells-wrap{
	position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
}
.detected-table-cell{
	background-color: #FF4C94;
	opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
	transition: opacity 0.25s;
	animation-name: fadeInOut;
	-webkit-animation-name: fadeInOut;
	animation-duration: 0.5s;
	-webkit-animation-duration: 0.5s;
}
.detected-table-row.title-row .detected-table-cell{
	background-color: #00AA88;
	opacity: 0.2;
}
.detected-table-row.empty-row .detected-table-cell{
	background-color: #000;
	opacity: 0.2;
}
.detected-table-cell:hover{
	opacity: 0.5 !important;
}
@-webkit-keyframes fadeInOut {
	0% {opacity: 0;}
	50% {opacity: 0.25;}
	100% {opacity: 0;}
}
@keyframes fadeInOut {
	0% {opacity: 0;}
	50% {opacity: 0.4;}
	100% {opacity: 0;}
}
`
