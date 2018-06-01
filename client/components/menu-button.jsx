
import React from 'react';

export default class MenuButton extends React.Component {
  constructor(props) {
    super(props);
    this.state={ showMenu: false }
    this.openMenu = this.openMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  handleClickOutside(e) {
    var clickedInside = this.refs.menuBtn && this.refs.menuBtn.contains(e.target);
    this.setState({ showMenu: clickedInside });
  }
  openMenu(){
    this.setState({ showMenu: true });
  }
  render() {
    let { name, btnCls, children} = this.props;
    let { showMenu } =this.state;
    return (
      <div className="menu-btn">
        <button className={btnCls} onClick={this.openMenu}>
          <span>{name}</span>
          <i className="fa fa-caret-down"/>
        </button>
        { showMenu &&
          <div className="menu" ref='menuBtn'>
            {children}
          </div>
        }
      </div>
    );
  }
}
