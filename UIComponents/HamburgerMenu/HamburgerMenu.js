import React from 'react';

export default class ToggleSwitch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			content: props.content,
			isOpen: false
		};
	}
	handleMenuToggle() {
		this.setState({isOpen: !this.state.isOpen});
	}
	render() {
		return (
			<div className="menu-wrapper">
				<style jsx global>
				{`
					.menu-wrapper {
						position: relative;
					}
					.hamburger {
						display: inline-block;
						cursor: pointer;
					}

					.bar1, .bar2, .bar3 {
						width: 25.5px;
						height: 4px;
						background-color: rgb(100, 109, 114);
						margin: 4px 0;
						border-radius: 4px;
					}
					.bar1, .bar3{
						transform-origin: 7.143% 50%;
						transition: 0.4s;
					}
					.bar2{
						transform-origin: 70% 50%;
						width: 17.85px;
						transform: Scale(1, 1);
						transition: 0.4s 0.4s;
					}

					.change .bar1 {
						transform: rotate(45deg);
					}

					.change .bar2 {
						transform: Scale(0, 1);
					}

					.change .bar3 {
						transform: rotate(-45deg);
					}
					.menu-content{
						display:none;
						background-color: #fff;
						color: rgb(100, 109, 114);
						position: absolute;
						width: 10vw;
						right: 0;
						padding: 1em;
						border: 1px solid #ccc;
						z-index: 1000;
						text-align: left;
					}
					.menu-content.open{
						display: block;
					}
				`}
				</style>
				<div dir="ltr" className={"hamburger " + (this.state.isOpen ? 'change' : '')} onClick={this.handleMenuToggle.bind(this)}>
					<div className="bar1"></div>
					<div className="bar2"></div>
					<div className="bar3"></div>
				</div>
				<div className={"menu-content " + (this.state.isOpen ? 'open' : '')}>
					{this.state.content}
				</div>
			</div>
		)
	}
}
