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
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }
  onDragOver(e){
    e.preventDefault();
  }
  onDrop(e, status){
    e.preventDefault();
    const stringified = e.dataTransfer.getData("text");
    if (!stringified) return;

    const data = JSON.parse(stringified);
    Meteor.call('updateTaskStatus', data.taskId, status, (e, res)=>{
      if(e) console.log(e);
    })

    e.dataTransfer.clearData();
  }
  renderBox(title, styleClass, taskStatus, tasksList){
    return <div className={styleClass} onDragOver={this.onDragOver} onDrop={(e)=> this.onDrop(e, taskStatus)}>
      <h3>{title}</h3>
      { tasksList.map(el=> <Task task={el} key={el._id} allowDrag={true}/>) }
    </div>;
  }
  render(){
    let tasks= this.props.tasks;

    let todoTasks = tasks.filter(el=>el.status == status.OPEN);
    let inprogressTasks = tasks.filter(el=>el.status == status.IN_PROGRESS);
    let doneTasks = tasks.filter(el=>el.status == status.CLOSED);

    //IDEA: add 'move to the future iteration' button for the to do and in progress items

    return <div className='sprint'>
      <h2>{this.props.iteration}</h2>
      <div className='sprint-dashboard'>
        { this.renderBox('TO DO', 'todo box', status.OPEN, todoTasks) }
        { this.renderBox('In progress', 'in-progress middle box', status.IN_PROGRESS, inprogressTasks) }
        { this.renderBox('Done', 'done box', status.CLOSED, doneTasks) }
      </div>
    </div>
  }
}

export default withTracker(props=>{
  let tasks = Tasks.find({ iteration: props.iteration }).fetch() || [];
  return { tasks };
})(SprintDashboard)
