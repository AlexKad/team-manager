import { Meteor } from 'meteor/meteor';
import {TeamMembers, Tasks} from '../imports/collections.js';

Meteor.methods({
  addTeamMember: (member)=>{

  },
  addTask: (task)=>{
    Tasks.insert(task);
  },
  getTaskById: (id)=>{

  }
});
