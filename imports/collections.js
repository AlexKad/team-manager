import { Mongo } from 'meteor/mongo';

export let TeamMembers = new Mongo.Collection('TeamMembers');
export let Tasks = new Mongo.Collection('Tasks');

TeamMembers.requiredFields = ['name', 'icon', 'title'];
Tasks.requiredFields = [
          'name',
          'type',
          'priority',
          'assignedTo',
          'status',
          'dateOpened',
          'dateClosed',
          'iteration',
          'attachement'];


export let Iterations = calculateIterations();

function calculateIterations(){
  let now = new Date();
  let offset = now.getDay();
  let start = new Date();
  let end = new Date();
  start.setDate(now.getDate() - offset+1);
  end.setDate(start.getDate()+5);

  let sprint1 = start.toLocaleDateString() + ' - ' + end.toLocaleDateString();
  start.setDate(start.getDate()+6);
  end.setDate(end.getDate()+6);

  return [ sprint1,
           start.toLocaleDateString() + ' - ' + end.toLocaleDateString(),
           'future iterations'];
}
