import React from 'react';
import Router from 'next/router';
import Meta from '../lib/meta';

import server from '../services/server';
import TableScanner from '../UIComponents/TableScanner/TableScanner';

export default class ScanContacts extends React.Component {

componentDidMount() {
}
render() {
	return (
		<div>
			<Meta/>
			<TableScanner/>
		</div>
	)
}

}