import Head from 'next/head'
import React from "react";
export default () => (
	<div>
		<Head title={"standing-together"}>
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
				href="../client/static/favicon.ico"
				rel="icon"
				type="image/x-icon"
			/>
			<link
				href="https://fonts.googleapis.com/css?family=Alef:400,700&amp;subset=hebrew"
				rel="stylesheet"
				type='text/css'
			/>
		</Head>
		<style jsx global>{`
		body {
			margin: 0;
			font-family: Cabin, Cairo, Rubik, sans-serif;
		}
		input, textarea, select, button {
			font-family: Cabin, Cairo, Rubik, sans-serif !important;
		}
		::-webkit-selection {
			background: rgb(255, 56, 131); /* WebKit/Blink Browsers */
			color: white;
		}
		::selection {
			background: rgb(255, 56, 131); /* WebKit/Blink Browsers */
			color: white;
		}
		`}</style>
	</div>
)
