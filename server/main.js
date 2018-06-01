import { Meteor } from 'meteor/meteor';
import { Team, Tasks, Tags, GanttCharts } from '../imports/collections.js';
import './api';

Meteor.startup(() => {
  Meteor.publish('Meteor.users', ()=> {
    let userId = Meteor.userId();
    let user = Meteor.users.findOne(userId);
    let teamId = user? user.info.teamId : null;
    if(teamId){
      return Meteor.users.find({'info.teamId': teamId}, {fields: {info: 1}});
    }
    else return Meteor.users.find(userId);
  });
  Meteor.publish('Tasks', ()=> {
    let userId = Meteor.userId();
    let user = Meteor.users.findOne(userId);
    let teamId = user? user.info.teamId : null;
    if(teamId) return Tasks.find({teamId});
    else return [];
  })
  Meteor.publish('Tags', ()=> Tags.find());
  Meteor.publish('Team', ()=> Team.find());
  Meteor.publish('GanttCharts', ()=> {
    let userId = Meteor.userId();
    let user = Meteor.users.findOne(userId);
    let teamId = user? user.info.teamId : null;
    if(teamId) return GanttCharts.find({teamId});
    else return [];
  })
});
