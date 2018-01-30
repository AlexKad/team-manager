import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, TeamMembers } from '../../imports/collections.js';
import { typesList, statusList, priorityList } from '../constants.js';

class PlanSprintBoard extends React.Component{
  constructor(props){
    super(props);
    this.state = { };
  }
  renderTask(task){
    //TODO: add checkbox
    return <div className='task' key={task._id}>
      <h4>{task.name}</h4>
      <span>Assigned to: {task.assignedTo}</span>
    </div>
  }
  render(){
    let { tasks, iteration }= this.props;
    let backLog = tasks.filter(el=> el.iteration != iteration);
    let current = tasks.filter(el=> el.iteration == iteration);

    //TODO: add 'move many' button
    //TODO: implement drag n drop
    return <div className='sprint-plan'>
      <h2>Planning Tasks for {this.props.iteration}</h2>
      <div className='sprint-plan-board'>
        <div className='todo'>
          <h3>Backlog</h3>
          { backLog.map(el=> this.renderTask(el)) }
        </div>
        <div className='buttons'>
          <button> -&gt; </button>
          <button> &lt;- </button>
        </div>
        <div className='in-progress'>
          <h3>{this.props.iteration}</h3>
          { current.map(el=> this.renderTask(el)) }
        </div>
      </div>
    </div>
  }
}

export default withTracker(props=>{
  let team = TeamMembers.find().fetch() || [];
  let tasks = Tasks.find({ status: statusList.OPEN }).fetch() || [];
  return { team, tasks };
})(PlanSprintBoard)
