import React from 'react';
import './AddFiltersBtn.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
library.add(faPlus);

class AddFiltersBtn extends React.Component {

  constructor(props){
    super(props);
    this.state = {
			isActive: false,
		}
  }

  componentDidMount() {
    const type = this.props.type;
    if(type === 'single'){
      this.setState({class: 'add-filter'});
    } else if(type === 'group'){
      this.setState({class: 'add-group'});
    }
  }

  render() {
    return(
      <section className={"add-button-wrap"}>
        <button type={"button"}
            className={"add-button " + this.state.class}
            onClick={this.props.onClick}
        >
          <FontAwesomeIcon icon={"plus"}/>
        </button>
      </section>
    )
  }
}

export default AddFiltersBtn;
