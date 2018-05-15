import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, Iterations, GanttCharts } from '../../imports/collections.js';
import { types, statuses, priorities } from '../../imports/constants.js';
import Task from './task';
import Dropdown from './dropdown';
import EditTask from './edit-task';
import ModalWnd from './modal-wnd';
import GanttChartPanel from './gantt-chart-panel';
import helper from '../../imports/lib.js';
import _ from 'lodash';

const DATE_BOX_WIDTH = 81;

class GanttChart extends React.Component{
  constructor(props){
    super(props);
    this.state = { tasks: [], selectedTasks:[],
      showEditTaskWindow: false, editTaskId: null,
      showChartsWindow: false }
    this.onEditTask = this.onEditTask.bind(this);
    this.onCloseEditWnd = this.onCloseEditWnd.bind(this);
    this.onCloseChartWnd = this.onCloseChartWnd.bind(this);
    this.saveChart = this.saveChart.bind(this);
    this.openChart = this.openChart.bind(this);
    this.onChartUpdate = this.onChartUpdate.bind(this);
  }
  onEditTask(taskId){
    this.setState({ editTaskId: taskId, showEditTaskWindow: true});
  }
  onCloseEditWnd(){
    this.setState({ editTaskId: null, showEditTaskWindow: false})
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
    this.setState(obj);
  }
  saveChart(){
    let { start, end, selectedTasks } = this.state;
    let chart = { start, end };
    chart.taskIds = selectedTasks.map(el=>el._id);
    Meteor.call('addGanttChart', chart, (err)=>{
      if (err) { alert('There was an error trying to save chart.'); console.warn(err); }
      else console.log('saved');
    });
  }
  openChart(){
    this.setState({showChartsWindow: true});
  }
  onCloseChartWnd(){
    this.setState({showChartsWindow: false});
  }
  onChartUpdate(tasks){
    this.setState({selectedTasks: tasks})
  }
  render(){
    let { dateError, start, end, showEditTaskWindow, editTaskId, showChartsWindow } = this.state;

    return <div className='gantt-chart'>
        <div className='input-group'>
          <label>Start from:</label>
          <input type='date' onChange={(e)=>this.dateChanged(e.target.value, 'start')}/>
          <label> till:</label>
          <input type='date' onChange={(e)=>this.dateChanged(e.target.value, 'end')}/>
          <span className='error'>{ dateError }</span>
          <button className='right-btn' onClick={this.openChart}>Open...</button>
          <button onClick={this.saveChart}>Save</button>
        </div>

        <GanttChartPanel start={start} end={end} onEditTask={this.onEditTask}
        onChartUpdate={this.onChartUpdate}/>
        { showEditTaskWindow?
          <ModalWnd title='Edit task' onClose={this.onCloseEditWnd}>
            <EditTask taskId={editTaskId} editDone={this.onCloseEditWnd}/>
          </ModalWnd> : ''
        }
        { showChartsWindow?
          <ModalWnd title='Saved Charts' onClose={this.onCloseChartWnd}>

          </ModalWnd> : ''
        }
    </div>
  }
}

export default withTracker(props=>{
  Meteor.subscribe('Tasks');
  Meteor.subscribe('Tags');
  Meteor.subscribe('Meteor.users');
  Meteor.subscribe('GanttCharts');
  let user = Meteor.users.findOne({ _id: Meteor.userId() });
  let charts = GanttCharts.find().fetch();
  return { charts };

})(GanttChart)
