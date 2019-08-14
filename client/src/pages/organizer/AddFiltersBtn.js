import React from 'react';
import './AddFiltersBtn.scss';

class AddFiltersBtn extends React.Component {

  constructor(props){
    super(props);
    this.state = {
			isActive: false,
		}
  }

  componentWillMount() {
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
        <div
            className={"addBtn " + this.state.class}
            onClick={this.props.onClick}
        >
          {this.props.text}
        </div>
      </section>
    )
  }
}

export default AddFiltersBtn;
