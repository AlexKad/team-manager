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
    this.state={ showPanel: false };
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
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
  render(){
    let { tags, teamUsers } = this.props;
    let typesList = helper.makeListFromEnum(types);
    typesList.unshift({id: 0, name: 'all'});
    let prioritiesList = helper.makeListFromEnum(priorities);
    prioritiesList.unshift({id: 0, name: 'all'});

    return <div className='task-filter'>
      <div className="row" onClick={()=> this.togglePanel()}>
        <i className="fa fa-sliders" title="filter tasks"/>
        <span>Filters</span>
      </div>
      {
        this.state.showPanel?
        <div className='panel' ref='filterPanel'>
          <div>
            <label>Tags</label>
            <Dropdown items={tags} onChange={(val)=>{this.setFilter(val, 'tag')} } selected={0}/>
          </div>
          <div>
            <label>Assigned to</label>
            <Dropdown items={teamUsers} onChange={(val)=>{this.setFilter(val, 'assignedTo')} } selected={0}/>
          </div>
          <div>
            <label>Types</label>
            <Dropdown items={typesList} onChange={(val)=>{this.setFilter(val, 'type')} } selected={0}/>
          </div>
          <div>
            <label>Priority</label>
            <Dropdown items={prioritiesList} onChange={(val)=>{this.setFilter(val, 'priority')} } selected={0}/>
          </div>
          <div className="buttons">
            <button>Reset</button>
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
