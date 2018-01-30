export let typesList = {
  TASK: 'task',
  BUG: 'bug'
};

export let types = [
  { id:1, name: typesList.TASK },
  { id:2, name: typesList.BUG }
];

export let statusList = {
  OPEN: 'open',
  IN_PROGRESS: 'in progress',
  CLOSED: 'closed/fixed'
};

export let statuses = [
  { id: 1, name: statusList.OPEN},
  { id: 2, name: statusList.IN_PROGRESS},
  { id: 3, name: statusList.CLOSED}
];

export let priorityList = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export let priority = [
  {id:1, name: priorityList.HIGH},
  {id:2, name: priorityList.MEDIUM},
  {id:3, name: priorityList.LOW}
];
