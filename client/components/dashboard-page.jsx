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
    this.state = { showEditTaskWindow: false, editTaskId: null };
    this.openTaskDetails = this.openTaskDetails.bind(this);
    this.onAddTaskClick = this.onAddTaskClick.bind(this);
    this.onEditTask = this.onEditTask.bind(this);
    this.onCloseEditWnd = this.onCloseEditWnd.bind(this);
    this.onlogOut = this.onlogOut.bind(this);
  }
  openTaskDetails(id){
    this.props.history.push('/details?'+id);
  }
  onAddTaskClick(){
    this.setState({ editTaskId: null, showEditTaskWindow: true});
  }
  onEditTask(taskId){
    this.setState({ editTaskId: taskId, showEditTaskWindow: true});
  }
  onCloseEditWnd(){
    this.setState({ editTaskId: null, showEditTaskWindow: false})
  }
  onlogOut(){
    Meteor.logout(err => {
      if (!err) this.props.history.push('/page/login');
    });
  }
  render(){
    let { showEditTaskWindow, editTaskId }= this.state;
    let user = this.props.currentUser;
    const userName = (user && user.info && user.info.name)?
                            user.info.name : 'Profile';
    const isAdmin = user && user.info && user.info.isAdmin;

    return <div className='dashboard-page'>

      <div className='top-nav'>
        <div>Team Task Manager</div>
        <div className='profile'>
          <span><i className='fa fa-user-circle' />{userName}</span>
          <i className='fa fa-sign-out' onClick={this.onlogOut}> </i>
        </div>
      </div>
      <button onClick={this.onAddTaskClick}><i className='fa fa-plus-circle'></i>Add new</button>

      <TabContainer>
        <Tab title="Current Sprint">
          <SprintDashboard iteration={Iterations[0]} onEditTask={ this.onEditTask}></SprintDashboard>
        </Tab>
        <Tab title="Plan Next Sprint">
          <PlanSprintBoard iteration={Iterations[1]} onEditTask={ this.onEditTask}></PlanSprintBoard>
        </Tab>
        <Tab title="Team & Workload">
          <EditTeam />
          {/* TODO: add workload chart */}
        </Tab>
        {/* <Tab title="All tasks">
          <TasksGrid onTaskClick={this.openTaskDetails}/>
        </Tab> */}
      </TabContainer>

      { showEditTaskWindow?
        <ModalWnd title={ editTaskId? 'Edit task' : 'Add task'} onClose={this.onCloseEditWnd}>
          <EditTask taskId={editTaskId} editDone={this.onCloseEditWnd}/>
        </ModalWnd> : ''
      }

    </div>;
 }
}

var DPage = withTracker(props => {
  Meteor.subscribe('Tasks');
  Meteor.subscribe('Tags');
  Meteor.subscribe('Meteor.users');
  let user = Meteor.users.findOne({ _id: Meteor.userId() });
  return { currentUser: user };
})(DashboardPage);

export default withRouter(DPage);
