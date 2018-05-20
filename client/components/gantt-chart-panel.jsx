import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, Iterations } from '../../imports/collections.js';
import { types, statuses, priorities } from '../../imports/constants.js';
import Task from './task';
import Dropdown from './dropdown';
import helper from '../../imports/lib.js';
import _ from 'lodash';

const DATE_BOX_WIDTH = 81;
const TASK_HEIGHT = 45;

class GanttChartPanel extends React.Component{
  constructor(props){
    super(props);
    this.state = { tasks: props.tasks, selectedTasks:[] }
    this.onChartTaskDrag = this.onChartTaskDrag.bind(this);
    this.setPosition = this.setPosition.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(!_.isEqual(this.props.tasks, nextProps.tasks)){
      this.setState({tasks: nextProps.tasks, selectedTasks: []});
    }
  }
  onEditTask(taskId){
    if(this.props.onEditTask){
      this.props.onEditTask(taskId);
    }
  }
  renderDates(){
    let { start, end } = this.props;
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
    let { teamList } = this.props;
    return selectedTasks.map((task,i)=>{
      let width = task.workTime? task.workTime/8*DATE_BOX_WIDTH : DATE_BOX_WIDTH;
      let user = _.find(teamList, el=> el.id == task.assignedTo, '');
      return <div className='chart-task' key={i} onDoubleClick={(e)=>this.onEditTask(task._id)}
        draggable={true} onDragStart={(e)=>this.onChartTaskDrag(e,task)}
        style={{ left: task.startInd*DATE_BOX_WIDTH, top: i*TASK_HEIGHT, width }}>
          <div className="row">{ task.name }</div>
          <div className="row">{ _.get(user, 'name', '') }</div>
      </div>
    })
  }
  renderTaskList(){
    let { start, end } = this.props;
    let { tasks } = this.state;
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
    if(!_.find(selectedTasks,el=>el._id == data.taskId || el._id == data._id)){
      let task = _.find(this.state.tasks, el=> el._id == data.taskId);
      task.startInd = start;
      selectedTasks.push(task);

      let tasks = this.state.tasks.filter(el=> el._id != data.taskId);
      this.setState({selectedTasks, tasks});
    }else{
      let task = _.find(selectedTasks,el=>el._id == data._id);
      task.startInd = start;
      this.setState(selectedTasks);
    }
    e.dataTransfer.clearData();
    if(this.props.onChartUpdate) this.props.onChartUpdate(selectedTasks);
  }
  onTasksListDrop(e){
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
    if(this.props.onChartUpdate) this.props.onChartUpdate(selectedTasks);
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
    let { dateError, selectedTasks, showEditTaskWindow, editTaskId } = this.state;
    let chartIsEmpty = !(selectedTasks && selectedTasks.length);

    return <div>
        <div className='chart-panel'>
          { this.renderDates() }
          <div className={chartIsEmpty? 'empty-chart': 'chart'}
               onDragOver={ this.onDragOver.bind(this) } onDrop={ this.onChartDrop.bind(this) }>
            { chartIsEmpty? 'Drag n drop tasks here from the list below.' : this.renderChart() }
          </div>
        </div>
        <div className='tasks' onDragOver={ this.onDragOver.bind(this) }
          onDrop={this.onTasksListDrop.bind(this)}>
          { this.renderTaskList() }
        </div>
    </div>
  }
}

export default withTracker(props=>{
  let { start, end } = props;
  let iterations= helper.getIterations(start, end);
  let tasks = Tasks.find({'iteration': {$in: iterations}}).fetch();

  let team = Meteor.users.find().fetch() || [];
  let teamList =  team.map(el=>{ return {id: el._id, name: el.info? el.info.name: ''} });

  return { tasks, teamList };

})(GanttChartPanel)
