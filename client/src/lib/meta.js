import React from "react";
import "./variables.scss";
import "./global.scss";
import "./classes.scss";
import favicon from "../static/favicon.ico"
export default () => (
	<div>
			<meta name="viewport" content="width=device-width, initial-scale=1"/>
			<meta charSet="utf-8"/>
			<link
				href='https://fonts.googleapis.com/css?family=Cabin'
				rel='stylesheet'
				type='text/css'
			/>
			<link
				href="https://fonts.googleapis.com/css?family=Cairo"
				rel="stylesheet"
				type='text/css'
			/>
			<link
				href="https://fonts.googleapis.com/css?family=Rubik"
				rel="stylesheet"
				type='text/css'
			/>
			<link
				href="https://fonts.googleapis.com/css?family=Assistant"
				rel="stylesheet"
				type='text/css'
			/>
			<link
				href={favicon}
				rel="icon"
				type="image/x-icon"
			/>
			<link
				href="https://fonts.googleapis.com/css?family=Alef:400,700&amp;subset=hebrew"
				rel="stylesheet"
				type='text/css'
			/>
	</div>
)
