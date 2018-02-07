import React from 'react';

export default class Dropdown extends React.Component{
  constructor(props){
    super(props);
    this.state={ selected: props.selected};
    this.onChange = this.onChange.bind(this);
  }
  onChange(e){
    let value = e.target.value;
    this.props.onChange(value);
    this.setState({selected: value});
  }
  render(){
    let { items, selected, idField } = this.props;
    idField = idField || 'id';
    let options = items.map(el => <option key={el[idField]} value={el[idField]}>{el.name}</option>);

    return <select onChange={this.onChange} value={this.state.selected}>
      {options}
    </select>
  }
}
