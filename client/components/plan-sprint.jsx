import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, TeamMembers } from '../../imports/collections.js';
import { types, statuses, priorities } from '../constants.js';
import Task from './task';
import Dropdown from './dropdown';

class PlanSprintBoard extends React.Component{
  constructor(props){
    super(props);
    this.state = { backlogCheckedTasks: [], sprintCheckedTasks: [] };
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onTaskCheck = this.onTaskCheck.bind(this);
    this.moveToSprint = this.moveToSprint.bind(this);
    this.moveToBacklog = this.moveToBacklog.bind(this);
  }
  onDragOver(e){
    e.preventDefault();
  }
  onDrop(e, iteration){
    e.preventDefault();
    const stringified = e.dataTransfer.getData("text");
    if (!stringified) return;

    const data = JSON.parse(stringified);
    Meteor.call('updateTasksIteration', [data.taskId], iteration, (e, res)=>{
      if(e) console.log(e);
    })

    e.dataTransfer.clearData();
  }
  onTaskCheck(taskId, isChecked, iteration){
    let isBacklog = iteration == 'future iterations';
    let checked = isBacklog? this.state.backlogCheckedTasks.slice() : this.state.sprintCheckedTasks.slice();
    if(isChecked) checked.push(taskId);
    else {
      let ind = checked.indexOf(taskId);
      checked.splice(ind, 1);
    }
    if(isBacklog) this.setState({ backlogCheckedTasks: checked });
    else this.setState({ sprintCheckedTasks: checked });
  }
  moveToSprint(){
    let sprint = this.props.iteration;
    let scope = this;
    Meteor.call('updateTasksIteration', this.state.backlogCheckedTasks, sprint, (e,res)=>{
      if(e) console.log(e);
      scope.setState({backlogCheckedTasks:[]});
    });
  }
  moveToBacklog(){
    let backlog = 'future iterations';
    scope = this;
    Meteor.call('updateTasksIteration', this.state.sprintCheckedTasks, backlog, (e,res)=>{
      if(e) console.log(e);
      scope.setState({sprintCheckedTasks: []});
    });
  }
  renderBox(title, styleClass, iteration, tasksList){
    return <div className={styleClass} onDragOver={this.onDragOver} onDrop={(e)=> this.onDrop(e, iteration)}>
              <h3>{title}</h3>
              { tasksList.map(el=>
                <Task task={el} key={el._id} onEdit={ this.props.onEditTask}
                  allowDrag={true} onTaskCheck={(taskId, isChecked)=>this.onTaskCheck(taskId, isChecked, iteration)}/>) }
           </div>
  }
  render(){
    let { tasks, iteration }= this.props;
    let backLog = tasks.filter(el=> el.iteration != iteration);
    let current = tasks.filter(el=> el.iteration == iteration);

    return <div className='plan-sprint'>
      <h2>Planning Tasks for {this.props.iteration}</h2>
      <div className='plan-sprint-board' >
        { this.renderBox('Backlog', 'todo box', 'future iterations', backLog)}
        <div className='buttons'>
          <button onClick={ this.moveToSprint }> -&gt; </button>
          <button onClick={ this.moveToBacklog }> &lt;- </button>
        </div>
        { this.renderBox(iteration, 'in-progress box', iteration, current)}
      </div>
    </div>
  }
}

export default withTracker(props=>{
  let tasks = Tasks.find({ status: statuses.OPEN }).fetch() || [];
  return { tasks };
})(PlanSprintBoard)
