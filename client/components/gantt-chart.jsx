import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, Iterations } from '../../imports/collections.js';
import { types, statuses, priorities } from '../../imports/constants.js';
import Task from './task';
import Dropdown from './dropdown';
import helper from '../../imports/lib.js';

 class GanttChart extends React.Component{
  constructor(props){
    super(props);
    this.state = { }
  }
  dateChanged(val, field){
    let { start, end } = this.state;
    let date;
    if(!val){ date = ''; }
    else{
      date = new Date(val);
      date.setDate(date.getUTCDate());
      date = date.getTime();
    }
    if(field == 'end' && start && start>date){
      this.setState({dateError: 'Start date should be earlier then end date'});
      return;
    }
    let obj = {};
    obj[field] = date;
    obj.dateError = '';
    this.setState(obj);
    if(start && end) this.filterTasks();
  }
  filterTasks(){
    let { start, end } = this.state;
    let iterations= helper.getIterations(start, end);
    console.log(iterations);
  }
  render(){
    let { dateError } = this.state;
    return <div className='gantt-chart'>
        <div className='input-group'>
          <label>Start from:</label>
          <input type='date' onChange={(e)=>this.dateChanged(e.target.value, 'start')}/>
          <label> till:</label>
          <input type='date' onChange={(e)=>this.dateChanged(e.target.value, 'end')}/>
          <span className='error'>{ dateError }</span>
        </div>
        <div className='chart-panel'>

        </div>
        <div className='tasks'>

        </div>
    </div>
  }
}

export default withTracker(props=>{
  Meteor.subscribe('Tasks');
  Meteor.subscribe('Tags');
  Meteor.subscribe('Meteor.users');
  let user = Meteor.users.findOne({ _id: Meteor.userId() });

  return {};

})(GanttChart)
