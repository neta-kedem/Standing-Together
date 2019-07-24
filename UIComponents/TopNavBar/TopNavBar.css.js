import css from 'styled-jsx/css'
export default css`
	.nav-bar-wrapper{
		position: relative;
		width: 100%;
		height: 55px;
		z-index: 10000;
	}
	.nav-bar{
	    position: fixed;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 55px;
		background-color: #90278e;
		font-size: 0.7em;
		box-shadow: 0px 0px 5px #00000099;
		z-index: 10000;
	}
	.nav-bar-logo{
		left: 0px;
		width: 80px;
		height: 55px;
		margin: 0 1em;
		background-image: url(../../static/Logo.svg);
		background-position: 0px 50%;
		background-size: contain;
		backgroundR-repeat: no-repeat;
	}
	.nav-bar-icon{
		left: 0px;
		line-height: 55px;
		padding: 0 1em;
		font-size: 25px;
		color: #efefef;
		cursor: pointer;
	}
	.menu-label{
	    line-height: 1.1em;
	    margin: 0 1em;
	    font-size: 0.7em;
	    display: inline-block;
        vertical-align: sub;
	}
	.nav-bar-icon:hover{
	    text-shadow: 0 0 3px 3px white;
	}
	.nav-bar-logo-menu-wrap{
	    position: relative;
	}
	.nav-bar-logo-menu{
	    display: none;
	    position: absolute;
	    padding: 0.5em;
	    background-color: #efefef;
	    z-index: 1000;
	    width: 10em;
	}
	.nav-bar-logo-menu-wrap:hover .nav-bar-logo-menu{
	    display: block;
	}
	.nav-bar-logout-button{
	    cursor: pointer;
	    background-color: #DDD;
	    padding: 0.25em;
	}
	.nav-bar-logout-button:hover{
	    color: #eee;
	    background-color: rgb(144, 39, 142);
	}
.sidebar-wrap {
	right: 0;
	position: fixed;
	top: 0px;
	bottom: 0px;
	z-index: 1000;
	height: 100%;
	transition: width 1s ease;
	-moz-transition: width 1s ease;
	-ms-transition: width 1s ease;
	-webkit-transition: width 1s ease;
	-o-transition: width 1s ease;
	width: 0;
	overflow: hidden;
	box-shadow: 0px 0px 5px #444444aa;
}

.sidebar-open .sidebar-wrap{
	width: 20%;
}
.sidebar-background {
	background-color: rgba(0,0,0,0.4);
	width: 0;
	height: 0;
	right: 0;
	top: 0;
	position: fixed;
	z-index: 999;
	opacity: 0;
	transition: opacity 1s ease;
	-moz-transition: opacity 1s ease;
	-ms-transition: opacity 1s ease;
	-webkit-transition: opacity 1s ease;
	-o-transition: opacity 1s ease;
}
.sidebar-open .sidebar-background
{
	opacity: 1;
	width: 100%;
	height: 100%;
}
.sidebar {
	background-color: #FAFAFA;
	height: 100%;
	width: 100%;
}
.sidebar-options .sidebar-item{
    display: block;
    width: 100%;
    text-align: center;
    padding: 5%;
    box-sizing: border-box;
    font-size: 1.25em;
	margin-right: -40vw;
	transition: margin 1s;
	-moz-transition: margin 1s;
	-ms-transition: margin 1s;
	-webkit-transition: margin 1s;
	-o-transition: margin 1s;
	overflow: hidden;
	text-overflow: clip;
	white-space: nowrap;
}
.sidebar-title{
    display: block;
    width: 100%;
    height: 55px;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    font-size: 1.5em;
    background-color: rgb(104, 0, 102);
    color: white;
    font-weight: bold;
    text-overflow: clip;
    overflow: hidden;
    white-space: nowrap;
    box-shadow: 0px 0px 5px #000000aa;
}
.sidebar-item.button{
    cursor: pointer;
    transition: background-color 0.25s;
}
.sidebar-item.button:hover{
    background-color: #ddd;
}
.sidebar-item.button:active{
    background-color: #ccc;
}
.sidebar-options .sidebar-item:nth-child(2){
	transition-delay: 0.15s;
	-moz-transition-delay: 0.15s;
	-ms-transition-delay: 0.15s;
	-webkit-transition-delay: 0.15s;
	-o-transition-delay: 0.15s;
}
.sidebar-options .sidebar-item:nth-child(3){
	transition-delay: 0.3s;
	-moz-transition-delay: 0.3s;
	-ms-transition-delay: 0.3s;
	-webkit-transition-delay: 0.3s;
	-o-transition-delay: 0.3s;
}
.sidebar-options .sidebar-item:nth-child(4){
	transition-delay: 0.45s;
	-moz-transition-delay: 0.45s;
	-ms-transition-delay: 0.45s;
	-webkit-transition-delay: 0.45s;
	-o-transition-delay: 0.45s;
}
.sidebar-options .sidebar-item:nth-child(5){
	transition-delay: 0.6s;
	-moz-transition-delay: 0.6s;
	-ms-transition-delay: 0.6s;
	-webkit-transition-delay: 0.6s;
	-o-transition-delay: 0.6s;
}
.sidebar-open .sidebar-options .sidebar-item{
	margin-right: 0;
}
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
`
