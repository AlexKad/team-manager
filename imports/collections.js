import { Mongo } from 'meteor/mongo';

export var TeamMembers = new Mongo.Collection('TeamMembers');
export var Tasks = new Mongo.Collection('Tasks');

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
