import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, Iterations } from '../../imports/collections.js';
import { types, statuses, priorities } from '../../imports/constants.js';
import Task from './task';
import Dropdown from './dropdown';
import helper from '../../imports/lib.js';
import _ from 'lodash';

const DATE_BOX_WIDTH = 81;

class GanttChart extends React.Component{
  constructor(props){
    super(props);
    this.state = { tasks: [], selectedTasks:[] }
    this.onChartTaskDrag = this.onChartTaskDrag.bind(this);
    this.setPosition = this.setPosition.bind(this);
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
  renderDates(){
    let { start, end } = this.state;
    if(start && end){
      let dates = helper.filterOutWeekends(new Date(start), new Date(end));
      return <div className="dates row">
        {dates.map(el=><div className="date-box" key={el}>
          <span className='name'>{helper.displayDateFromMs(el)}</span>
        </div>)}
      </div>
    }
    return null;
  }
  renderChart(){
    let { selectedTasks } = this.state;
    return selectedTasks.map((task,i)=>{
      let width = task.workTime? task.workTime/8*DATE_BOX_WIDTH : DATE_BOX_WIDTH;
      return <div className='chart-task' key={i} draggable={true} onDragStart={(e)=>this.onChartTaskDrag(e,task)}
        style={{ left: task.startInd*DATE_BOX_WIDTH, top: i*40, width }}>
          { task.name }
      </div>
    })
  }
  renderTaskList(){
    let {start, end, tasks } = this.state;
    if(!start || !end) return <div className='empty'>Please, select time interval.</div>
    if(!tasks) return <div className='empty'>There are no tasks in the selected time interval.</div>;

    return tasks.map(el=>
      <Task task={el} key={el._id} allowDrag={true} onDrag={this.onTaskDrag.bind(this)}/>
    );
  }
  onDragOver(e){
    e.preventDefault();
  }
  onChartDrop(e){
    e.preventDefault();
    const stringified = e.dataTransfer.getData("text");
    if (!stringified) return;

    let pos = JSON.parse(e.dataTransfer.getData("pos"));
    let x = e.clientX - pos.x;
    let y = e.clientY - pos.y;

    let start = Math.floor(x/DATE_BOX_WIDTH);

    const data = JSON.parse(stringified);
    let selectedTasks = this.state.selectedTasks;
    if(!_.find(selectedTasks,el=>el._id == data.taskId)){
      let task = _.find(this.state.tasks, el=> el._id == data.taskId);
      task.startInd = start;
      selectedTasks.push(task);

      let tasks = this.state.tasks.filter(el=> el._id != data.taskId);
      this.setState({selectedTasks, tasks});
    }else{
      let task = _.find(selectedTasks,el=>el._id == data.taskId);
      task.startInd = start;
      this.setState(selectedTasks);
    }
    e.dataTransfer.clearData();
  }
  onTaskDrop(e){
    e.preventDefault();
    const stringified = e.dataTransfer.getData("text");
    if (!stringified) return;

    const data = JSON.parse(stringified);
    if(data.startInd == undefined) return;
    let { tasks, selectedTasks }  = this.state;
    let task = selectedTasks.find(el=> el._id == data._id);
    selectedTasks= selectedTasks.filter(el=> el._id != data._id);
    tasks.push(task);
    this.setState({tasks, selectedTasks});
  }
  onTaskDrag(e){
    this.setPosition(e);
  }
  onChartTaskDrag(e,task){
    let data = JSON.stringify(task);
    e.dataTransfer.setData("text", data);
    this.setPosition(e);
  }
  setPosition(e){
    let position = {x: (e.offsetX || e.clientX - $(e.target).offset().left),
                    y: (e.offsetY || e.clientY - $(e.target).offset().top) };
    e.dataTransfer.setData("pos",JSON.stringify(position));
  }
  render(){
    let { dateError, selectedTasks } = this.state;
    let chartIsEmpty = !(selectedTasks && selectedTasks.length);

    return <div className='gantt-chart'>
        <div className='input-group'>
          <label>Start from:</label>
          <input type='date' onChange={(e)=>this.dateChanged(e.target.value, 'start')}/>
          <label> till:</label>
          <input type='date' onChange={(e)=>this.dateChanged(e.target.value, 'end')}/>
          <span className='error'>{ dateError }</span>
        </div>
        <div className='chart-panel'>
          { this.renderDates() }
          <div className={chartIsEmpty? 'empty-chart': 'chart'}
               onDragOver={ this.onDragOver.bind(this) } onDrop={ this.onChartDrop.bind(this) }>
            { chartIsEmpty? 'Drag n drop tasks here from the list below.' : this.renderChart() }
          </div>
        </div>
        <div className='tasks' onDragOver={ this.onDragOver.bind(this) }
          onDrop={this.onTaskDrop.bind(this)}>
          { this.renderTaskList() }
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
