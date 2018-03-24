import { Meteor } from 'meteor/meteor';
import { Tasks, Tags} from '../imports/collections.js';
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
  }
});
