import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS,
} from '../actions/user';
import { lcStorage } from '../core/utils/localStorage'


const token = lcStorage.get('access_token');
const userRole = lcStorage.get('role');
const user = lcStorage.get('user');
const initialState = {
	access_token: token,
	email: user.email || "",
	name: user.name || "",
	role: userRole,
	isAuthenticated: token ? true : false
}

export default function auth(state = initialState, action) {
  switch (action.type) {
      case LOGIN_REQUEST:
          return Object.assign({}, state, {
              isFetching: true,
              isAuthenticated: false,
          });
      case LOGIN_SUCCESS:
          return Object.assign({}, state, {
							email: action.payload.data.email,
							name: action.payload.data.name,
							role: action.payload.role,
              isFetching: false,
              isAuthenticated: true,
          });
      case LOGIN_FAILURE:
          return Object.assign({}, state, {
              isFetching: false,
              isAuthenticated: false,
              errorMessage: action.payload.message,
          });
      case LOGOUT_SUCCESS:
          return Object.assign({}, state, {
              isAuthenticated: false,
              errorMessage: ''
          });
      default:
          return state;
  }
}
