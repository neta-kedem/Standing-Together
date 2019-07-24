import React from 'react';
import style from './AddFiltersBtn.css';

class AddFiltersBtn extends React.Component {

  constructor(props){
    super(props)
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
        <style jsx>
          {`
          .addBtn {
            display: inline-block;
            font-size: 21px;
            padding: 10px;
            cursor: pointer;
            user-select: none;
          }
          .addFilterButton {
            color: #565F6B;
          }
          .addFilterButton:active {
            color: #F7B3D3;
          }
          .addGroupButton {
            color: #F7B3D3;
          }
          .addGroupButton:active {
            color: #B77393;
          }
          `}
        </style>
        <div
            className={"addBtn "+ this.state.class}
            onClick={this.props.onClick}
        >
          {this.props.text}
          </div>
      </section>
    )
  }
}

export default AddFiltersBtn;
