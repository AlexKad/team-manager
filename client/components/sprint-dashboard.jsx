import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, TeamMembers } from '../../imports/collections.js';
import { typesList, statusList, priorityList } from '../constants.js';

class SprintDashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = { };
  }
  renderTask(task){
    return <div className='task' key={task._id}>
      <h4>{task.name}</h4>
      <span>Assigned to: {task.assignedTo}</span>
    </div>
  }
  render(){
    let tasks= this.props.tasks;

    let todo = tasks.filter(el=>el.status == statusList.OPEN);
    let inprogress = tasks.filter(el=>el.status == statusList.IN_PROGRESS);
    let done = tasks.filter(el=>el.status == statusList.CLOSED);

    //IDEA: add 'move to the future iteration' button for the to do and in progress items

    return <div className='sprint'>
      <h2>{this.props.iteration}</h2>
      <div className='sprint-dashboard'>
        <div className='todo'>
          <h3>TO DO</h3>
          { todo.map(el=> this.renderTask(el)) }
        </div>
        <div className='in-progress'>
          <h3>In Progress</h3>
          { inprogress.map(el=> this.renderTask(el)) }
        </div>
        <div className='done'>
          <h3>Done</h3>
          { done.map(el=> this.renderTask(el)) }
        </div>
      </div>
    </div>
  }
}

export default withTracker(props=>{
  let team = TeamMembers.find().fetch() || [];
  let tasks = Tasks.find({ iteration: props.iteration }).fetch() || [];
  return { team, tasks };
})(SprintDashboard)
