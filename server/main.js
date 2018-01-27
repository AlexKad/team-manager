import { Meteor } from 'meteor/meteor';
import {TeamMembers, Tasks} from '../imports/collections.js';
import './api';

Meteor.startup(() => {
  Meteor.publish('TeamMembers', () => TeamMembers.find());
  Meteor.publish('Tasks', ()=> Tasks.find());
});
