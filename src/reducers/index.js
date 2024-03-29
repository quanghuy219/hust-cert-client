import { combineReducers } from 'redux';
import auth from './auth';
import runtime from './runtime';
import navigation from './navigation';
import posts from './posts';
import classes from './class';
import student from './student';
import loader from './loader';

import courses from './courses';

export default combineReducers({
  auth,
  runtime,
  navigation,
  posts,
  classes,
  student,
  loader,
  courses,
});
