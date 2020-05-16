import { FETCH_CLASSES_SUCCESS, FETCH_CLASS_SUCCESS, UPDATE_GRADES_SUCCESS } from '../actions/class';

const initialState = {
    data: [],
    itemsPerPage: 20,
    totalItems: 0,
    class: {
        enrollments: [],
        course: {},
        lecturer: {}
    }
}

export default function classes(state = initialState, action) {
  switch (action.type) {
      case FETCH_CLASSES_SUCCESS:
          return Object.assign({}, state, {
              data: action.payload.data,
              itemsPerPage: action.payload.itemsPerPage || 20,
              totalItems: action.payload.totalItems || 0
          });
    case FETCH_CLASS_SUCCESS:
          return Object.assign({}, state, {
              class: action.payload
          })
    case UPDATE_GRADES_SUCCESS:
        return Object.assign({}, state, {
            class: action.payload
        })
      default:
          return state;
  }
}
