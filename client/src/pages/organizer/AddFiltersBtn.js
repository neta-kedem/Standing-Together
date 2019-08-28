import React from 'react';
import './AddFiltersBtn.scss';

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
      this.setState({class: 'addFilterButton'});
    } else if(type === 'group'){
      this.setState({class: 'addGroupButton'});
    }
  }

  render() {
    return(
      <section>
        <button type={"button"}
            className={"addBtn " + this.state.class}
            onClick={this.props.onClick}
        >
          {this.props.text}
        </button>
      </section>
    )
  }
}

export default AddFiltersBtn;
