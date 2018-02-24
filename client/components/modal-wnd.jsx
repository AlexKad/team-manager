
import React from 'react';

export default class ModalWnd extends React.Component {
  constructor(props) {
    super(props);
    this.closeWnd = this.closeWnd.bind(this);
  }
  closeWnd(e){
    if(e.target.className == 'window' || e.target.className == 'close-btn'){
      this.props.onClose();
    };
  }
  render() {
    return (
      <div className='window' onClick={this.closeWnd}>
        <div className='content'>
          <span className='close-btn' onClick={this.closeWnd}>&times;</span>
          <h4>{this.props.title}</h4>
          { this.props.children }
        </div>
      </div>
    );
  }
}
