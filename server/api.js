import { Meteor } from 'meteor/meteor';
import {TeamMembers, Tasks} from '../imports/collections.js';

Meteor.methods({
  saveTeamMember: (member)=>{
    TeamMembers.insert(member);
  },
  removeTeamMember: (id)=>{
    TeamMembers.remove({ _id: id });
  },
  addTask: (task)=>{
    Tasks.insert(task);
  },
  getTaskById: (id)=>{

  }
});
