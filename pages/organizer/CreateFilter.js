import React from 'react';

class CreateQuery extends React.Component {
	constructor(props){
		super(props);
		this.state({
			index: props.key,
			returnQuery: props.newQuery,


		})

	}

	render() {
		return(
				<section>

				</section>
		)
	}
}

export default CreateQuery;
