import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Dropdown from './dropdown';
import { Tasks, TeamMembers, Iterations, Tags } from '../../imports/collections.js';
import { types, statuses, priorities } from '../constants.js';
import helper from '../helper.js';

class EditTask extends React.Component{
  constructor(props){
    super(props);
    let taskData = props.task? this.getTaskData(props.task) : this.getDefaultTaskData();
    taskData.filteredTags = [];

    this.state= taskData;
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onTypeChanged = this.onTypeChanged.bind(this);
    this.onPriorityChanged = this.onPriorityChanged.bind(this);
    this.onAssignedToChanged = this.onAssignedToChanged.bind(this);
    this.onIterationChanged = this.onIterationChanged.bind(this);
    this.onTypeTags = this.onTypeTags.bind(this);
  }
  getTaskData(task){
    return {
      name: task.name,
      type: task.type,
      tag: task.tag || '',
      priority: task.priority,
      iteration: task.iteration,
      assignedTo: task.assignedTo
    };
  }
  getDefaultTaskData(){
    let { teamMembers, sprints } = this.props;
    return {
      name: '',
      type: types.TASK,
      tag: '',
      priority: priorities.MEDIUM,
      iteration: sprints[0].id,
      assignedTo: teamMembers.length? teamMembers[0].id : ''
    };
  }
  onSave(){
    let { name, tag, type, priority, assignedTo, iteration } = this.state;

    let currTime = new Date();
    let task = {
      name: name,
      type: type,
      tag: tag,
      priority: priority,
      assignedTo: assignedTo,
      status: statuses.OPEN,
      dateOpened: currTime,
      dateClosed: null,
      iteration: iteration,
      attachement: null
    };
    if(this.props.task) task._id = this.props.task._id;
    Meteor.call('addTask', task, (err) => {
        if (err) { alert('There was an error trying to save task.'); console.warn(err); }
        else console.log('saved');
    });
    this.resetSelection();
    this.props.editDone();
  }
  onCancel(){
    this.resetSelection();
    this.props.editDone();
  }
  resetSelection(){
    let data = this.getDefaultTaskData();
    this.setState(data);
  }
  onTypeChanged(type){ this.setState({type}); }
  onPriorityChanged(priority){ this.setState({priority}); }
  onIterationChanged(iteration){ this.setState({iteration}); }
  onAssignedToChanged(assignedTo){ this.setState({assignedTo}); }
  onTypeTags(e){
    let val = e.target.value;
    this.setState({tag: val});
    setTimeout(()=>{ this.filterTags()}, 600);
  }
  filterTags(){
    let value = this.state.tag.toLowerCase();
    let allTags = this.props.allTags;
    let matchTags = allTags.filter(tag=> tag.name.toLowerCase().indexOf(value)>-1);
    this.setState({ filteredTags: matchTags});
  }
  render(){
    let { teamMembers, sprints } = this.props;
    let { name, tag, type, priority, iteration, assignedTo, filteredTags } = this.state;
    return <div className='edit-task'>
        <div className='form-group long'>
          <label>Name</label>
          <input id='name' value={name} onChange={(e)=> this.setState({name: e.target.value})}></input>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input id="tags"  value={tag} onChange={(e)=>this.onTypeTags(e)}></input>
          { filteredTags.length?
            <div className='tags-list'>
            { filteredTags.map(el=> <div key={el._id}>{el.name}</div>)}
          </div> : '' }
        </div>

        <div className='form-group'>
          <div>
            <label>Type</label>
            <Dropdown items={helper.makeListFromEnum(types)} onChange={this.onTypeChanged} selected={type}/>
          </div>
          <div>
            <label>Priority</label>
            <Dropdown items={helper.makeListFromEnum(priorities)} onChange={this.onPriorityChanged} selected={priority}/>
          </div>
        </div>

        <div className='form-group'>
          <div>
            <label>Iteration</label>
            <Dropdown items={sprints} onChange={this.onIterationChanged} selected={iteration}/>
          </div>
          <div>
            <label>Assign To</label>
            <Dropdown items={teamMembers} onChange={this.onAssignedToChanged} selected={assignedTo}/>
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
  let allTags = Tags.find().fetch();
  return { teamMembers, sprints, task, allTags };
})(EditTask);
