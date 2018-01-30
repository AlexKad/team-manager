import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import TasksGrid from './task-grid';
import EditTask from './edit-task';
import EditTeam from './edit-team';
import SprintDashboard from './sprint-dashboard';
import PlanSprintBoard from './plan-sprint';

class DashboardPage extends React.Component{
  constructor(props){
    super(props);
    this.state = { };
    this.openTaskDetails = this.openTaskDetails.bind(this);
  }
  openTaskDetails(id){
    this.props.history.push('/details?'+id);
  }
  render(){
    return <div className='dashboard-page'>
      <div><h2>Team Task Manager</h2></div>
      <EditTask />
      <EditTeam />
      {/* <TasksGrid onTaskClick={this.openTaskDetails}/> */}
      {/* <SprintDashboard iteration="future iterations"></SprintDashboard> */}
      <PlanSprintBoard iteration="future iterations"></PlanSprintBoard>
    </div>;
 }
}

var DPage = withTracker(props => {
  Meteor.subscribe('TeamMembers');
  Meteor.subscribe('Tasks');
  return { };
})(DashboardPage);

export default withRouter(DPage);
