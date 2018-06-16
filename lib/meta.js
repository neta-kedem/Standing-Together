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
		</Head>
		<style jsx global>{`
		body {
			margin: 0;
			font-family: Cabin, Cairo, Rubik, sans-serif;
		}
		input, textarea{
			font-family: Cabin, Cairo, Rubik, sans-serif !important;
		}
		`}</style>
	</div>
)
