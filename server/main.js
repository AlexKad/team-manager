import { Meteor } from 'meteor/meteor';
import { TeamMembers, Tasks, Tags } from '../imports/collections.js';
import './api';

Meteor.startup(() => {
  Meteor.publish('Meteor.users', ()=> {
    let userId = Meteor.userId();
    let user = Meteor.users.findOne(userId);
    let teamId = user? user.info.teamId : null;
    if(teamId) return Meteor.users.find({'info.teamId': teamId});
    return [];
  });
  Meteor.publish('Tasks', ()=> {
    let userId = Meteor.userId();
    let user = Meteor.users.findOne(userId);
    let teamId = user? user.info.teamId : null;
    if(teamId) return Tasks.find({teamId});
    else return [];
  })
  Meteor.publish('Tags', ()=> Tags.find());
});
