import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, TeamMembers } from '../../imports/collections.js';
import { types, status, priority } from '../constants.js';
import Dropdown from './dropdown';

class SprintDashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = { };
    this.assignedToChanged = this.assignedToChanged.bind(this);
  }
  assignedToChanged(taskId, assignedTo){

  }
  renderTask(task){
    let teamList = this.props.teamList;
    let personName = '';
    if(task.assignedTo){
      let member = TeamMembers.findOne(task.assignedTo);
      if(member) personName = member.name;
    }

    return <div className='task' key={task._id}>
      <h4>{task.name}</h4>
      <span>{task.iteration}</span><br/>
      <span>Assigned to:
        <Dropdown items={teamList} onChange={(id)=> this.assignedToChanged(task._id, id)} selected={task.assignedTo}/>
      </span>
    </div>
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
          { todo.map(el=> this.renderTask(el)) }
        </div>
        <div className='in-progress middle box'>
          <h3>In Progress</h3>
          { inprogress.map(el=> this.renderTask(el)) }
        </div>
        <div className='done box'>
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
  let teamList =  team.map(el=>{ return {id: el._id, name: el.name} });
  teamList.push({id:'', name:''});
  return { team, tasks, teamList };
})(SprintDashboard)
