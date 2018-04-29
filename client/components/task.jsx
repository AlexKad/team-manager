import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, TeamMembers } from '../../imports/collections.js';
import { types, statuses, priorities } from '../../imports/constants.js';
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
    //TODO
  }
  renderPriority(pr, type){
    switch(pr){
      case priorities.HIGH:
        return <span className="red">{type}</span>;
      case priorities.MEDIUM:
        return <span className="green">{type}</span>;
      case priorities.LOW:
        return <span className="blue">{type}</span>;
      default:
       return "";
    }
  }
  renderTag(tag){
    if(tag){
      return <span className="tag">{tag}</span>;
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
      { onTaskCheck? <input type="checkbox" onChange={this.onCheck}/> : ''}
      <h4> [ {this.renderPriority(task.priority,task.type)} ]
           { this.renderTag(task.tag) } </h4>

      <h4> { task.name }</h4>
      <div>Assigned to:
        <Dropdown items={teamList} onChange={this.assignedToChanged} selected={task.assignedTo}/>
      </div>
      <div>{task.iteration}</div>
      <div><i className="edit fa fa-edit" onClick={(e)=>this.props.onEdit(task._id)}></i></div>
    </div>
  }
}

export default withTracker(props=>{
  let team = Meteor.users.find().fetch() || [];
  let teamList =  team.map(el=>{ return {id: el._id, name: el.info? el.info.name: ''} });
  teamList.push({id:'', name:''});
  return { teamList };
})(Task)
