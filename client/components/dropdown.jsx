import React from 'react';

export default class Dropdown extends React.Component{
  constructor(props){
    super(props);
    this.state={};
    this.onChange = this.onChange.bind(this);
  }
  onChange(e){
    this.props.onChange(e.target.value);
  }
  render(){
    let { items, selected, idField } = this.props;
    idField = idField || 'id';
    let options = items.map(el => <option key={el[idField]}>{el.name}</option>);

    return <select onChange={this.onChange} value={selected}>
      {options}
    </select>
  }
}
