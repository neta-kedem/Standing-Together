import css from 'styled-jsx/css'
export default css`
	.nav-bar-wrapper{
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 55px;
		background-color: #90278e;
		font-size: 0.7em;
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
`
