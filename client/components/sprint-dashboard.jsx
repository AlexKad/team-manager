import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, TeamMembers } from '../../imports/collections.js';
import { types, status, priority } from '../constants.js';
import Task from './task';
import Dropdown from './dropdown';

class SprintDashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = { };
  }
  render(){
    let tasks= this.props.tasks;

    let todo = tasks.filter(el=>el.status == status.OPEN);
    let inprogress = tasks.filter(el=>el.status == status.IN_PROGRESS);
    let done = tasks.filter(el=>el.status == status.CLOSED);

    //IDEA: add 'move to the future iteration' button for the to do and in progress items

    return <div className='sprint'>
      <h2>{this.props.iteration}</h2>
      <div className='sprint-dashboard'>
        <div className='todo box'>
          <h3>TO DO</h3>
          { todo.map(el=> <Task task={el} key={el._id}/>) }
        </div>
        <div className='in-progress middle box'>
          <h3>In Progress</h3>
          { inprogress.map(el=> <Task task={el} key={el._id}/>) }
        </div>
        <div className='done box'>
          <h3>Done</h3>
          { done.map(el=> <Task task={el} key={el._id}/>) }
        </div>
      </div>
    </div>
  }
}

export default withTracker(props=>{
  let tasks = Tasks.find({ iteration: props.iteration }).fetch() || [];
  return { tasks };
})(SprintDashboard)
