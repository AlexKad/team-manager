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
    this.state = { };
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
          { backLog.map(el=> <Task task={el} key={el._id}/>) }
        </div>
        <div className='buttons'>
          <button> -&gt; </button>
          <button> &lt;- </button>
        </div>
        <div className='in-progress box'>
          <h3>{this.props.iteration}</h3>
          { current.map(el=> <Task task={el} key={el._id}/>) }
        </div>
      </div>
    </div>
  }
}

export default withTracker(props=>{
  let tasks = Tasks.find({ status: status.OPEN }).fetch() || [];
  return { tasks };
})(PlanSprintBoard)
