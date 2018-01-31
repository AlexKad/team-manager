
import React from 'react';

export class TabContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedIndex: 0 };
  }
  _onTabClick(index) {
    if (index != this.state.selectedIndex)
      this.setState({ selectedIndex: index });
  }
  _renderTabs() {
    const { selectedIndex } = this.state;
    return <div className="tabs">
        { React.Children.map(this.props.children, (tab, i) => {
          const { title } = tab.props;
          const tabCls = `tab-btn${selectedIndex === i ? ' active' : ''}`;
          return <button key={i} className={tabCls} onClick={() => this._onTabClick(i)}>
            { title }
          </button>
        }) }

    </div>;
  }
  _renderCurrentTabContent() {
    const { selectedIndex } = this.state;
    return this.props.children[selectedIndex];
  }
  render() {
    return (
      <div className="tab-container">
        { this._renderTabs() }
        { this._renderCurrentTabContent() }
      </div>
    );
  }
}

export class Tab extends React.Component{
  constructor(props){
    super(props);

  }
  render(){
    return <div>{this.props.children}</div>
  }
}
