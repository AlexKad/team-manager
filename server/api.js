import { Meteor } from 'meteor/meteor';
import {TeamMembers, Tasks} from '../imports/collections.js';
import _ from 'lodash';

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
    return Tasks.findOne(id);
  },
  updateTaskStatus: (id, newStatus)=>{
    return Tasks.update(id, {$set: { status: newStatus } });
  },
  updateTasksIteration: (ids, newIter)=>{
    _.each(ids, function(taskId) {
      Tasks.update(taskId, {$set: { iteration: newIter } });
    });
  }
});
