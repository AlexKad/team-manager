import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import TasksGrid from './task-grid';
import AddItem from './add-item';
import EditTeam from './edit-team';

class DashboardPage extends React.Component{
  constructor(props){
    super(props);
    this.state = { };
  }

  render(){
    return <div className='dashboard-page'>
      <div><h2>Team Task Manager</h2></div>
      <AddItem />
      <EditTeam />
      <TasksGrid />
    </div>;
 }
}

var DPage = withTracker(props => {
  Meteor.subscribe('TeamMembers');
  Meteor.subscribe('Tasks');
  return { };
})(DashboardPage);

export default withRouter(DPage);
