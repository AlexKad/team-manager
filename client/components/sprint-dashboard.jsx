import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../../imports/collections.js';
import { types, statuses, priorities } from '../../imports/constants.js';
import Task from './task';
import Dropdown from './dropdown';
import _ from 'lodash';

class SprintDashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = { tasks: props.tasks };
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.filterChanged = this.filterChanged.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(!_.isEqual(this.props.tasks, nextProps.tasks)){
      this.setState({ tasks: nextProps.tasks});
    }
  }
  onDragOver(e){
    e.preventDefault();
  }
  onDrop(e, status){
    e.preventDefault();
    const stringified = e.dataTransfer.getData("text");
    if (!stringified) return;

    const data = JSON.parse(stringified);
    Meteor.call('updateTaskStatus', data.taskId, status, (e, res)=>{
      if(e) console.log(e);
    })

    e.dataTransfer.clearData();
  }
  filterChanged(e){
    let isChecked = e.target.checked;
    let tasks = this.state.tasks;
    if(isChecked){
      let userId = this.props.user._id;
      tasks = tasks.filter(el=> el.assignedTo == userId);
      this.setState({tasks});
    }
    else{
      this.setState({ tasks: this.props.tasks });
    }
  }
  renderBox(title, styleClass, taskStatus, tasksList){
    return <div className={styleClass} onDragOver={this.onDragOver} onDrop={(e)=> this.onDrop(e, taskStatus)}>
      <h3>{title}</h3>
      { tasksList.map(el=> <Task task={el} key={el._id} onEdit={ this.props.onEditTask} allowDrag={true}/>) }
    </div>;
  }
  render(){
    let tasks= this.state.tasks;

    let todoTasks = tasks.filter(el=>el.status == statuses.OPEN);
    let inprogressTasks = tasks.filter(el=>el.status == statuses.IN_PROGRESS);
    let doneTasks = tasks.filter(el=>el.status == statuses.CLOSED);

    //IDEA: add 'move to the future iteration' button for the to do and in progress items

    return <div className='sprint'>
      <h2>{this.props.iteration}</h2>
      <div className='row filters'>
        <input type='checkbox' onChange={this.filterChanged}/><label>Show only assigned to me</label>
      </div>
      <div className='sprint-dashboard'>
        { this.renderBox('TO DO', 'todo box', statuses.OPEN, todoTasks) }
        { this.renderBox('In progress', 'in-progress middle box', statuses.IN_PROGRESS, inprogressTasks) }
        { this.renderBox('Done', 'done box', statuses.CLOSED, doneTasks) }
      </div>
    </div>
  }
}

export default withTracker(props=>{
  let tasks = Tasks.find({ iteration: props.iteration }).fetch() || [];
  let user = Meteor.users.findOne({ _id: Meteor.userId() });

  return { tasks, user };
})(SprintDashboard)
