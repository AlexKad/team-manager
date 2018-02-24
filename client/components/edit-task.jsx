import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Dropdown from './dropdown';
import { TeamMembers, Iterations } from '../../imports/collections.js';
import { types, status, priority } from '../constants.js';
import helper from '../helper.js';

class EditTask extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      type: types.TASK,
      priority: priority.MEDIUM,
      iteration: props.sprints[0].id,
      assignedTo: ''
    };

    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onTypeChanged = this.onTypeChanged.bind(this);
    this.onPriorityChanged = this.onPriorityChanged.bind(this);
    this.onAssignedToChanged = this.onAssignedToChanged.bind(this);
    this.onIterationChanged = this.onIterationChanged.bind(this);
  }
  onSave(){
    let { type, priority, assignedTo, iteration } = this.state;

    let currTime = new Date();
    let task = {
      name: this.taskName.value,
      type: type,
      priority: priority,
      assignedTo: assignedTo,
      status: status.OPEN,
      dateOpened: currTime,
      dateClosed: null,
      iteration: iteration,
      attachement: null
    };
    Meteor.call('addTask', task, (err) => {
        if (err) { alert('There was an error trying to save task.'); console.warn(err); }
        else console.log('saved');
    });
    this.taskName.value = '';
    this.resetSelection();
    this.props.editDone();
  }
  onCancel(){
    this.taskName.value = '';
    this.resetSelection();
    this.props.editDone();
  }
  resetSelection(){
    let { teamMembers, sprints } = this.props;
    this.setState({
      type: types.TASK,
      priority: priority.MEDIUM,
      iteration: sprints[0].id,
      assignedTo: teamMembers.length? teamMembers[0].id : null
    });
  }
  onTypeChanged(type){ this.setState({type}); }
  onPriorityChanged(priority){ this.setState({priority}); }
  onIterationChanged(iteration){ this.setState({iteration}); }
  onAssignedToChanged(assignedTo){ this.setState({assignedTo}); }

  render(){
    let { teamMembers, sprints } = this.props;

    return <div className='edit-task'>
        <div className='form-group long'>
          <label>Name</label>
          <input id='name' ref={(x)=> this.taskName = x}></input>
        </div>

        <div className='form-group'>
          <div>
            <label>Type</label>
            <Dropdown items={helper.makeListFromEnum(types)} onChange={this.onTypeChanged} selected={types.TASK}/>
          </div>
          <div>
            <label>Priority</label>
            <Dropdown items={helper.makeListFromEnum(priority)} onChange={this.onPriorityChanged} selected={priority.MEDIUM}/>
          </div>
        </div>

        <div className='form-group'>
          <div>
            <label>Iteration</label>
            <Dropdown items={sprints} onChange={this.onIterationChanged} selected={sprints[0].id}/>
          </div>
          <div>
            <label>Assign To</label>
            <Dropdown items={teamMembers} onChange={this.onAssignedToChanged} selected={''}/>
          </div>
        </div>

        <div className='buttons'>
          <button onClick={this.onSave}>Save</button>
          <button onClick={this.onCancel}>Cancel</button>
        </div>
    </div>
  }
}
export default withTracker(props => {
  let teamMembers = TeamMembers.find().fetch() || [];
  teamMembers = teamMembers.map(el=>{ return {id: el._id, name: el.name} });
  teamMembers.push({id:'', name:''});
  let sprints = Iterations.map(el=> {return { id: el, name: el} });
  let task;
  if(props.taskId) task = Tasks.findOne(props.taskId);
  return { teamMembers, sprints, task };
})(EditTask);
