import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../../imports/collections.js';
import { types, statuses, priorities } from '../../imports/constants.js';
import Dropdown from './dropdown';
import helper from '../helper.js';
import _ from 'lodash';

class TaskFilter extends React.Component{
  constructor(props){
    super(props);
    this.state={ showPanel: false, tag: 0, assignedTo: 0, type: 0, priority: 0 };
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.renderSelected = this.renderSelected.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  handleClickOutside(e) {
    var clickedInside = this.refs.filterPanel && this.refs.filterPanel.contains(e.target);
    this.setState({ showPanel: clickedInside });
  }
  togglePanel() {
      this.setState(prevState => ({ showPanel: !prevState.showPanel }));
  }
  setFilter(val, field){
    if(this.state[field] != val){
      let filter = {};
      filter[field] = val;
      this.setState(filter);
    }
  }
  applyFilters(){
    let filters = [];
    let settings = ['tag', 'assignedTo', 'type', 'priority'];
    for(let i=0; i< settings.length; i++){
      if(this.state[settings[i]]){
        filters.push({name: settings[i], value: this.state[settings[i]]});
      }
    }
    this.setState({showPanel: false});
    this.props.onFiltersChanged(filters);
  }
  resetFilters(){
    this.setState({tag: 0, assignedTo: 0, type: 0, priority: 0, showPanel: false});
    this.props.onFiltersChanged([]);
  }
  removeFilter(name){
    let filter = {};
    filter[name] = 0;
    this.setState(filter);
    this.applyFilters();
  }
  renderSelected(){
    let settings = ['tag', 'assignedTo', 'type', 'priority'];
    let selected = [];
    for(let i=0; i< settings.length; i++){
      if(this.state[settings[i]]){
        selected.push(<div className="row selected" key={settings[i]}>{this.state[settings[i]]}<span onClick={()=>this.removeFilter(settings[i])}>&#10005;</span></div>);
      }
    }
    return selected;
  }
  render(){
    let { tags, teamUsers } = this.props;
    let typesList = helper.makeListFromEnum(types);
    typesList.unshift({id: 0, name: 'all'});
    let prioritiesList = helper.makeListFromEnum(priorities);
    prioritiesList.unshift({id: 0, name: 'all'});

    return <div className='task-filter'>
      <div className="row">
        <span onClick={()=> this.togglePanel()}>
          <i className="fa fa-sliders" title="filter tasks"/>
          Filters
       </span>
        { !this.state.showPanel ? this.renderSelected() : null}
      </div>
      {
        this.state.showPanel?
        <div className='panel' ref='filterPanel'>
          <div>
            <label>Tags</label>
            <Dropdown items={tags} onChange={(val)=>{this.setFilter(val, 'tag')} } selected={this.state.tag}/>
          </div>
          <div>
            <label>Assigned to</label>
            <Dropdown items={teamUsers} onChange={(val)=>{this.setFilter(val, 'assignedTo')} } selected={this.state.assignedTo}/>
          </div>
          <div>
            <label>Types</label>
            <Dropdown items={typesList} onChange={(val)=>{this.setFilter(val, 'type')} } selected={this.state.type}/>
          </div>
          <div>
            <label>Priority</label>
            <Dropdown items={prioritiesList} onChange={(val)=>{this.setFilter(val, 'priority')} } selected={this.state.priority}/>
          </div>
          <div className="buttons">
            <button onClick={ this.resetFilters}>Reset</button>
            <button onClick={ this.applyFilters }>Filter</button>
          </div>
        </div> : null
      }
    </div>
  }
}

export default withTracker(props => {
  let tasks = Tasks.find().fetch();
  let tags = _.uniq(tasks.map(el=> el.tag));
  tags = tags.map(el=> {return {id: el, name: el} });
  tags.unshift({id: 0, name:' all'});

  let teamUsers = Meteor.users.find().fetch();
  teamUsers = teamUsers.map(el=>{ return {
    id: el._id,
    name: el.info? el.info.name: ''}
  });
  teamUsers.unshift({id: 0, name:' all'});

  return { tags, teamUsers }
})(TaskFilter);
