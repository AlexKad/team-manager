import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import TasksGrid from './task-grid';
import EditTask from './edit-task';
import EditTeam from './edit-team';
import SprintDashboard from './sprint-dashboard';
import PlanSprintBoard from './plan-sprint';
import ModalWnd from './modal-wnd';
import GanttChart from './gantt-chart';
import Navigation from './navigation';
import { TabContainer, Tab } from './tab-container';
import { Iterations } from '../../imports/collections.js';

class DashboardPage extends React.Component{
  constructor(props){
    super(props);
    let view = 'current-sprint';
    if(props.currentUser && props.currentUser.info && !props.currentUser.info.teamId){
      view = 'team';
    }
    this.state = { showEditTaskWindow: false, editTaskId: null, view: 'current-sprint' };
    this._renderMainView = this._renderMainView.bind(this);
    this.openTaskDetails = this.openTaskDetails.bind(this);
    this.onEditTask = this.onEditTask.bind(this);
    this.onCloseEditWnd = this.onCloseEditWnd.bind(this);
    this.onlogOut = this.onlogOut.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.currentUser && !this.props.currentUser){
      let teamExists = nextProps.currentUser.info && nextProps.currentUser.info.teamId;
      this.setState({view: teamExists? 'current-sprint' : 'team'})
    }
  }
  openTaskDetails(id){
    this.props.history.push('/details?'+id);
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
  _renderMainView(){
    let view = this.state.view;
    let user = this.props.currentUser;
    const userName = (user && user.info && user.info.name)? user.info.name : 'Profile';
    const isAdmin = user && user.info && user.info.isAdmin;
    let teamExists = user && user.info && user.info.teamId;

    switch(view){
      case 'current-sprint':
        return <SprintDashboard teamExists={teamExists} iteration={Iterations[0]} onEditTask={ this.onEditTask}></SprintDashboard>;
      case 'next-sprint':
       return <PlanSprintBoard teamExists={teamExists} iteration={Iterations[1]} onEditTask={ this.onEditTask}></PlanSprintBoard>;
      case 'team':
        return <EditTeam />;
      case 'gantt-chart':
        return <GanttChart />;
      default:
        return <SprintDashboard iteration={Iterations[0]} onEditTask={ this.onEditTask}></SprintDashboard>;
    }
  }
  render(){
    let { showEditTaskWindow, editTaskId, view }= this.state;
    let user = this.props.currentUser;
    const userName = (user && user.info && user.info.name)? user.info.name : 'Profile';
    const isAdmin = user && user.info && user.info.isAdmin;
    let teamExists = user && user.info && user.info.teamId;

    return <div className='row dashboard-page'>
            <Navigation activeView={this.state.view} onChanged={(active)=>this.setState({view: active})} />

              {/* <div className='top-nav'>
                <div>Team Task Manager</div>

                <div className='profile'>
                  <span><i className='fa fa-user-circle' />{userName}</span>
                  <i className='fa fa-sign-out' onClick={this.onlogOut}> </i>
                </div>
              </div> */}
            { this._renderMainView() }
            { showEditTaskWindow?
              <ModalWnd title={ editTaskId? 'Edit task' : 'Add task'} onClose={this.onCloseEditWnd}>
                <EditTask taskId={editTaskId} editDone={this.onCloseEditWnd}/>
              </ModalWnd> : ''
            }
        </div>
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
