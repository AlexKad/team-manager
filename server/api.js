import { Meteor } from 'meteor/meteor';
import {TeamMembers, Tasks, Tags} from '../imports/collections.js';
import _ from 'lodash';

Meteor.methods({
  saveTeamMember: (member)=>{
    TeamMembers.insert(member);
  },
  removeTeamMember: (id)=>{
    TeamMembers.remove({ _id: id });
  },


  addTask: (task)=>{
    if(task._id){
      Tasks.upsert({_id: task._id}, task);
    }
    else {
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
  }
});
