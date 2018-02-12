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
  render(){
    let {task, teamList } = this.props;
    return <div className='task'>
      <div></div>
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
