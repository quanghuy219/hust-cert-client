import { lcStorage } from '../core/utils/localStorage';
import { loginApi } from '../core/api';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export function logoutUser() {
  return (dispatch) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    dispatch({
      type: LOGOUT_SUCCESS,
    });
  };
}

export const loginAction = {
  LOGIN_SUCCESS_STATE: 'LOGIN_SUCCESS_STATE',
  LOGIN_ERROR_STATE: 'LOGIN_ERROR_STATE',

  loginSuccess: (res) => ({
    type: LOGIN_SUCCESS,
    payload: res,
  }),

  loginError: (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
  }),

  handleLoginSuccess: (res) => {
    const { data, access_token, role } = res;
    lcStorage.set('user', data);
    lcStorage.set('access_token', access_token);
    lcStorage.set('role', role);
  },

  login: (email, password, role, router) => {
    return async function (dispatch) {
      dispatch({ type: LOGIN_REQUEST });
      await loginApi.login(email, password, role).then(
        (res) => {
          loginAction.handleLoginSuccess(res);
          dispatch(loginAction.loginSuccess(res));
        },
        (error) => {
          console.log(error);
          dispatch(loginAction.loginError(error));
        },
      );
    };
  },

  studentLogin: (id, password) => {
    return async function (dispatch) {
      dispatch({ type: LOGIN_REQUEST });
      await loginApi.studentLogin(id, password).then(
        (res) => {
          loginAction.handleLoginSuccess(res);
          dispatch(loginAction.loginSuccess(res));
        },
        (error) => {
          console.log(error);
          dispatch(loginAction.loginError(error));
        },
      );
    };
  },
};
