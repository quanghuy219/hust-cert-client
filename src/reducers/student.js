import { FETCH_ENROLLMENTS_SUCCESS } from '../actions/student';

const initialState = {
  enrollments: [],
};

export default function student(state = initialState, action) {
  switch (action.type) {
    case FETCH_ENROLLMENTS_SUCCESS:
      return Object.assign({}, state, {
        enrollments: action.payload,
      });
    default:
      return state;
  }
}
