import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks, TeamMembers } from '../../imports/collections.js';

class DetailsPage extends React.Component{
  constructor(props){
    super(props);
    this.state = { };
  }

  render(){
    let task = this.props.task;

    return <div>
      <h4>{task.name}</h4>
    </div>
 }
}

var DPage = withTracker(props => {
  Meteor.subscribe('TeamMembers');
  Meteor.subscribe('Tasks');

  let id = props.location.search.slice(1);
  let task = Tasks.findOne(id) || {};
  return { task };
})(DetailsPage);

export default withRouter(DPage);
