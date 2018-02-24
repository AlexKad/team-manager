import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import TasksGrid from './task-grid';
import EditTask from './edit-task';
import EditTeam from './edit-team';
import SprintDashboard from './sprint-dashboard';
import PlanSprintBoard from './plan-sprint';
import ModalWnd from './modal-wnd';
import { TabContainer, Tab } from './tab-container';
import { Iterations } from '../../imports/collections.js';

class DashboardPage extends React.Component{
  constructor(props){
    super(props);
    this.state = { showEditTaskForm: false };
    this.openTaskDetails = this.openTaskDetails.bind(this);
    this.onAddClick = this.onAddClick.bind(this);
  }
  openTaskDetails(id){
    this.props.history.push('/details?'+id);
  }
  onAddClick(){
    this.setState({showEditTaskForm: true });
  }
  render(){
    let { showEditTaskForm }= this.state;
    return <div className='dashboard-page'>
      <div><h2>Team Task Manager</h2></div>
      <button onClick={this.onAddClick}><i className='fa fa-plus-circle'></i>Add new</button>
      { showEditTaskForm? <EditTask editDone={()=>this.setState({showEditTaskForm: false})}/> : ''}

      <TabContainer>
        <Tab title="Current Sprint">
          <SprintDashboard iteration={Iterations[0]}></SprintDashboard>
        </Tab>
        <Tab title="Plan Next Sprint">
          <PlanSprintBoard iteration={Iterations[1]}></PlanSprintBoard>
        </Tab>
        <Tab title="Team & Workload">
          <EditTeam />
          {/* TODO: add workload chart */}
        </Tab>
        <Tab title="All tasks">
          <TasksGrid onTaskClick={this.openTaskDetails}/>
        </Tab>
      </TabContainer>

      <ModalWnd title="Edit task">
          <div>Edit tasks</div>
      </ModalWnd>
    </div>;
 }
}

var DPage = withTracker(props => {
  Meteor.subscribe('TeamMembers');
  Meteor.subscribe('Tasks');
  return { };
})(DashboardPage);

export default withRouter(DPage);
