import { Mongo } from 'meteor/mongo';

export let Team = new Mongo.Collection('Team');
export let Tasks = new Mongo.Collection('Tasks');
export let Tags = new Mongo.Collection('Tags');

Team.requiredFields = [
  'name'
];

Tasks.requiredFields = [
          'name',
          'type',
          'tag',
          'priority',
          'assignedTo',
          'status',
          'workTime',
          'openDate',
          'closeDate',
          'iteration',
          'attachement'
        ];


export let Iterations = calculateIterations();

function calculateIterations(){
  let now = new Date();
  let offset = now.getDay();
  let start = new Date();
  let end = new Date();

  start.setDate(now.getDate() - offset+1);
  end.setDate(now.getDate() - offset+5);

  let sprint1 = start.toLocaleDateString() + ' - ' + end.toLocaleDateString();
  start.setDate(start.getDate()+7);
  end.setDate(end.getDate()+7);

  return [ sprint1,
           start.toLocaleDateString() + ' - ' + end.toLocaleDateString(),
           'future iterations'];
}
