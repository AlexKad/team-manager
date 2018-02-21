import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, TeamMembers } from '../../imports/collections.js';
import { types, status, priority } from '../constants.js';
import Dropdown from './dropdown';

class Task extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
    this.assignedToChanged = this.assignedToChanged.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }
  assignedToChanged(taskId, assignedTo){

  }
  renderPriority(pr){
    switch(pr){
      case priority.HIGH:
        return <span className="fa fa-arrow-up red" />;
      case priority.MEDIUM:
        return <span className="fa fa-circle yellow"/>;
      case priority.LOW:
        return <span className="fa fa-arrow-down green" />;
      default:
       return "";
    }
  }
  onDrag(e){
    let data = JSON.stringify({ taskId: this.props.task._id });
    e.dataTransfer.setData("text", data);
  }
  onCheck(e){
    this.props.onTaskCheck(this.props.task._id, e.target.checked);
  }
  render(){
    let {task, teamList, allowDrag, onTaskCheck } = this.props;
    return <div className='task' draggable={allowDrag} onDragStart={ this.onDrag }>
      <div>
        { onTaskCheck? <input type="checkbox" onChange={this.onCheck}/> : ''}
      </div>
      <h4> {this.renderPriority(task.priority)} {task.name}</h4>
      <div>Assigned to:
        <Dropdown items={teamList} onChange={this.assignedToChanged} selected={task.assignedTo}/>
      </div>
      <div>{task.iteration}</div>
    </div>
  }
}

export default withTracker(props=>{
  let team = TeamMembers.find().fetch() || [];
  let teamList =  team.map(el=>{ return {id: el._id, name: el.name} });
  teamList.push({id:'', name:''});
  return { teamList };
})(Task)
