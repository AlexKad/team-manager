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
    this.state = { showEditTaskForm: false, showEditTaskWindow: false, editTaskId: null };
    this.openTaskDetails = this.openTaskDetails.bind(this);
    this.onAddTaskClick = this.onAddTaskClick.bind(this);
    this.onEditTask = this.onEditTask.bind(this);
    this.onCloseEditWnd = this.onCloseEditWnd.bind(this);
  }
  openTaskDetails(id){
    this.props.history.push('/details?'+id);
  }
  onAddTaskClick(){
    this.setState({showEditTaskForm: true });
  }
  onEditTask(taskId){
    this.setState({ editTaskId: taskId, showEditTaskWindow: true});
  }
  onCloseEditWnd(){
    this.setState({ editTaskId: null, showEditTaskWindow: false})
  }
  render(){
    let { showEditTaskForm, showEditTaskWindow }= this.state;
    return <div className='dashboard-page'>
      <div><h2>Team Task Manager</h2></div>
      <button onClick={this.onAddTaskClick}><i className='fa fa-plus-circle'></i>Add new</button>
      { showEditTaskForm? <EditTask editDone={()=>this.setState({showEditTaskForm: false})}/> : ''}

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
        <Tab title="All tasks">
          <TasksGrid onTaskClick={this.openTaskDetails}/>
        </Tab>
      </TabContainer>

      { showEditTaskWindow?
        <ModalWnd title="Edit task" onClose={this.onCloseEditWnd}>
          <EditTask taskId={this.state.editTaskId} editDone={this.onCloseEditWnd}/>
        </ModalWnd> : ''
      }

    </div>;
 }
}

var DPage = withTracker(props => {
  Meteor.subscribe('TeamMembers');
  Meteor.subscribe('Tasks');
  return { };
})(DashboardPage);

export default withRouter(DPage);
