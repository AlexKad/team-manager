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
    this.state = { tasks: [] }
  }
  dateChanged(val, field){
    let { start, end } = this.state;
    let date;
    if(!val){ date = ''; }
    else{
      date = new Date(val + 'T00:00');
      date = date.getTime();
    }
    if(field == 'end' && start && start>date){
      this.setState({dateError: 'Start date should be earlier then end date'});
      return;
    }
    let obj = {};
    obj[field] = date;
    obj.dateError = '';
    this.setState(obj, ()=>{
      if(this.state.start && this.state.end) this.filterTasks();
    });

  }
  filterTasks(){
    let { start, end } = this.state;
    let iterations= helper.getIterations(start, end);
    let tasks = Tasks.find({'iteration': {$in: iterations}}).fetch();
    this.setState({tasks});
  }
  renderTasks(){
    let {start, end, tasks } = this.state;
    if(!start || !end) return <div className='empty'>Please, select time interval.</div>
    if(!tasks) return <div className='empty'>There are no tasks in the selected time interval.</div>;

    return tasks.map(el=>
      <Task task={el} key={el._id} allowDrag={true}/>
    );
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
          { this.renderTasks() }
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
