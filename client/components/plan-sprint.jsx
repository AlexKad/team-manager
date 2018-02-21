import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, TeamMembers } from '../../imports/collections.js';
import { types, status, priority } from '../constants.js';
import Task from './task';
import Dropdown from './dropdown';

class PlanSprintBoard extends React.Component{
  constructor(props){
    super(props);
    this.state = { checkedTasks: [] };
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onTaskCheck = this.onTaskCheck.bind(this);
  }
  onDragOver(e){
    e.preventDefault();
  }
  onDrop(e, iteration){
    e.preventDefault();
    const stringified = e.dataTransfer.getData("text");
    if (!stringified) return;

    const data = JSON.parse(stringified);
    Meteor.call('updateTaskIteration', data.taskId, iteration, (e, res)=>{
      if(e) console.log(e);
    })

    e.dataTransfer.clearData();
  }
  onTaskCheck(taskId, isChecked){
    let checked = this.state.checkedTasks.slice()
    if(isChecked) checked.push(taskId);
    else {
      let ind = checked.indexOf(taskId);
      checked.splice(ind, 1);
    }
    this.setState({ checkedTasks: checked })
  }
  renderBox(title, styleClass, iteration, tasksList){
    return <div className={styleClass} onDragOver={this.onDragOver} onDrop={(e)=> this.onDrop(e, iteration)}>
              <h3>{title}</h3>
              { tasksList.map(el=> <Task task={el} key={el._id} allowDrag={true} onTaskCheck={this.onTaskCheck}/>) }
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
      <div className='plan-sprint-board' >
        { this.renderBox('Backlog', 'todo box', 'future iterations', backLog)}
        <div className='buttons'>
          <button> -&gt; </button>
          <button> &lt;- </button>
        </div>
        { this.renderBox(iteration, 'in-progress box', iteration, current)}
      </div>
    </div>
  }
}

export default withTracker(props=>{
  let tasks = Tasks.find({ status: status.OPEN }).fetch() || [];
  return { tasks };
})(PlanSprintBoard)
