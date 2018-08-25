import React from 'react';
import Router from 'next/router';
import Meta from '../lib/meta';

import server from '../services/server';
import TableScanner from '../UIComponents/TableScanner/TableScanner';
import ImageUploader from '../UIComponents/ImageUploader/ImageUploader';

export default class ScanContacts extends React.Component {

componentDidMount() {
}
render() {
	return (
		<div>
			<Meta/>
			<ImageUploader/>
			<TableScanner/>
		</div>
	)
}

}