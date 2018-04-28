import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, Iterations } from '../../imports/collections.js';
import { types, statuses, priorities } from '../../imports/constants.js';
import Task from './task';
import Dropdown from './dropdown';

 class GanttChart extends React.Component{
  constructor(props){
    super(props);

  }
  render(){
    return <div className='gantt-chart'>
        <div className='input-group'>
          <label>Start from:</label>
          <input type='date'/>
          <label> - Till:</label>
          <input type='date'/>
        </div>
        <div className='chart-panel'>

        </div>
        <div className='tasks'>

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
