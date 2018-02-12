import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, TeamMembers } from '../../imports/collections.js';
import { types, status, priority } from '../constants.js';
import Dropdown from './dropdown';

class PlanSprintBoard extends React.Component{
  constructor(props){
    super(props);
    this.state = { };
    this.assignedToChanged = this.assignedToChanged.bind(this);
  }
  assignedToChanged(taskId, assignedTo){

  }
  renderTask(task){
    //TODO: add checkbox
    let teamList = this.props.teamList;


    return <div className='task' key={task._id}>
      <h4>{task.name}</h4>
      <span>Assigned to:
        <Dropdown items={teamList} onChange={(id)=> this.assignedToChanged(task._id, id)} selected={task.assignedTo}/>
      </span>
    </div>
  }
  render(){
    let { tasks, iteration }= this.props;
    let backLog = tasks.filter(el=> el.iteration != iteration);
    let current = tasks.filter(el=> el.iteration == iteration);

    //TODO: add 'move many' button
    //TODO: implement drag n drop
    return <div className='plan-sprint'>
      <h2>Planning Tasks for {this.props.iteration}</h2>
      <div className='plan-sprint-board'>
        <div className='todo box'>
          <h3>Backlog</h3>
          { backLog.map(el=> this.renderTask(el)) }
        </div>
        <div className='buttons'>
          <button> -&gt; </button>
          <button> &lt;- </button>
        </div>
        <div className='in-progress box'>
          <h3>{this.props.iteration}</h3>
          { current.map(el=> this.renderTask(el)) }
        </div>
      </div>
    </div>
  }
}

export default withTracker(props=>{
  let team = TeamMembers.find().fetch() || [];
  let tasks = Tasks.find({ status: status.OPEN }).fetch() || [];
  let teamList =  team.map(el=>{ return {id: el._id, name: el.name} });
  teamList.push({id:'', name:''});
  return { team, tasks, teamList };
})(PlanSprintBoard)
