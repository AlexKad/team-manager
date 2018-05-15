import { Meteor } from 'meteor/meteor';
import { Tasks, Team, Tags, GanttCharts } from '../imports/collections.js';
import { statuses } from '../imports/constants.js';
import _ from 'lodash';

Meteor.methods({
  addTask: (task)=>{
    if(task._id){
      let oldTask = Tasks.findOne(task._id);
      if(oldTask.status!= statuses.CLOSED && task.status == statuses.CLOSED){
        task.closeDate = (new Date()).getTime();
      }
      Tasks.upsert({_id: task._id}, task);
    }
    else {
      let userId = Meteor.userId();
      let user = Meteor.users.findOne(userId);
      let teamId = user? user.info.teamId : null;
      task.teamId = teamId;
      task.openDate = (new Date()).getTime();
      Tasks.insert(task);
    }
    if(task.tag){
      Tags.upsert({name: task.tag}, { name: task.tag});
    }
  },
  getTaskById: (id)=>{
    return Tasks.findOne(id);
  },
  updateTaskStatus: (id, newStatus)=>{
    return Tasks.update(id, {$set: { status: newStatus } });
  },
  updateTasksIteration: (ids, newIter)=>{
    _.each(ids, function(taskId) {
      Tasks.update(taskId, {$set: { iteration: newIter } });
    });
  },

  createNewTeam: (teamName)=>{
    let teamId = Team.insert({name: teamName});
    let userId = Meteor.userId();
    Meteor.users.update(userId, { $set: { 'info.teamId': teamId } });
    return Team.findOne(teamId);
  },
  inviteNewTeamUser:(userMail)=>{
    let userId = Meteor.userId();
    let user = Meteor.users.findOne(userId);
    let isAdmin = user && user.info && user.info.isAdmin;
    if(!isAdmin) throw new Meteor.Error('This operation allowed only for admin user. Current user is not an admin.');

    let teamId = user.info.teamId;
    if(!teamId) throw new Meteor.Error('There is no team associated with current user. Please create new teambefore invite.');

    let newUser = Meteor.users.findOne({username: userMail});
    if(newUser) {
      Meteor.users.update(newUser._id, { $set: { 'info.teamId': teamId } });
    }
    else{
      //TODO: send an invitation by email
      return '/registration&teamId='+teamId;
    }
  },
  removeUserFromTeam: (userId)=>{
    let currentUserId = Meteor.userId();
    let currentUser = Meteor.users.findOne(currentUserId);
    let isAdmin = currentUser && currentUser.info && currentUser.info.isAdmin;
    if(!isAdmin) throw new Meteor.Error('This operation allowed only for admin user. Current user is not an admin.');

    Meteor.users.update(userId, { $set: { 'info.teamId': '' } });
  },

  addGanttChart(chart){
    if(chart._id){
      GanttCharts.upsert({_id: chart._id}, chart);
    }
    else{
      let userId = Meteor.userId();
      let user = Meteor.users.findOne(userId);
      let teamId = user? user.info.teamId : null;
      chart.teamId = teamId;
      GanttCharts.insert(chart);
    }
  }
});
