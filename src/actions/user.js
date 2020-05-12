import { lcStorage } from '../core/utils/localStorage'
import { loginApi } from '../core/api'

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export function logoutUser() {
  return dispatch => {
    localStorage.removeItem('id_token');
    document.cookie = 'id_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };
}

export const loginAction = {
	LOGIN_SUCCESS_STATE: 'LOGIN_SUCCESS_STATE',
	LOGIN_ERROR_STATE: 'LOGIN_ERROR_STATE',

	loginSuccess: res => ({
		type: LOGIN_SUCCESS,
		payload: res
	}),

	loginError: error => ({
		type: LOGIN_FAILURE,
		payload: error
	}),

  logoutUser: () => {
    return dispatch => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      dispatch({
        type: LOGOUT_SUCCESS
      })
    };
  },

	login: ( email, password, router ) => {
		return async function ( dispatch ) {
      dispatch({type: LOGIN_REQUEST});

			await loginApi.login(email, password).then( res => {
				const {data, message, access_token} = res;
				lcStorage.set('user', data);
				lcStorage.set('access_token', access_token);
				// if(router.location.query.redirect) {
				// 	router.push(router.location.query.redirect)
				// } else {
				// 	router.push('/')
				// }
				dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
				})
				dispatch (loginAction.loginSuccess ({message, status: true}))
			}, error => {
				console.log(error);
      })			
		}
	}
}