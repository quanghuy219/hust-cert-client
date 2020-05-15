import { FETCH_CLASSES_SUCCESS } from '../actions/class';

const initialState = {
    data: [],
    itemsPerPage: 20,
    totalItems: 0
}

export default function classes(state = initialState, action) {
  switch (action.type) {
      case FETCH_CLASSES_SUCCESS:
          return Object.assign({}, state, {
              data: action.payload.data,
              itemsPerPage: action.payload.itemsPerPage || 20,
              totalItems: action.payload.totalItems || 0
          });

      default:
          return state;
  }
}
