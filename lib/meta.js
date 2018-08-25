import Head from 'next/head'
export default () => (
	<div>
		<Head>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta charSet="utf-8 " />
			<link
				href='https://fonts.googleapis.com/css?family=Cabin'
				rel='stylesheet'
				type='text/css'
			></link>
			<link
				href="https://fonts.googleapis.com/css?family=Cairo"
				rel="stylesheet"
				type='text/css'
			></link>
			<link
				href="https://fonts.googleapis.com/css?family=Rubik"
				rel="stylesheet"
				type='text/css'
			></link>
			<link
				href="../static/favicon.ico"
				rel="icon"
				type="image/x-icon"
			></link>
		</Head>
		<style jsx global>{`
		body {
			margin: 0;
			font-family: Cabin, Cairo, Rubik, sans-serif;
		}
		input, textarea, select, button {
			font-family: Cabin, Cairo, Rubik, sans-serif !important;
		}
		::selection {
			background: rgb(255, 56, 131); /* WebKit/Blink Browsers */
			color: white;
		}
		::-moz-selection {
			background: rgb(255, 56, 131); /* Gecko Browsers */
			color: white;
		}
		`}</style>
	</div>
)
