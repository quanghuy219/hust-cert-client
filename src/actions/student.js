import { studentApi } from '../core/api';
import { generalUtils } from '../core/utils/general';

export const FETCH_ENROLLMENTS_SUCCESS = 'FETCH_ENROLLMENTS_SUCCESS';

export const studentAction = {
  handleError(error) {
    generalUtils.showErrorNotification(error.message);
  },

  fetchStudentEnrollmentSuccess: (res) => ({
    type: FETCH_ENROLLMENTS_SUCCESS,
    payload: res,
  }),

  fetchStudentEnrollments: () => {
    return async function (dispatch) {
      await studentApi.getEnrollments().then(
        (res) => {
          dispatch(studentAction.fetchStudentEnrollmentSuccess(res));
        },
        (error) => {
          studentAction.handleError(error)
        },
      );
    };
  },

  fetchStudentVerificationHistory: () => {
    return studentApi.getVerficationHistory().then(
      res => {
        return Promise.resolve(res)
      },
      error => {
        studentAction.handleError(error)
      })
  },

  createVerificationRequest: (verifier, enrollments = [], degrees = [], duration) => {
    return studentApi.createVerfificationRequest(verifier, enrollments, degrees, duration).then(
      res => {
        return Promise.resolve(res)
      },
      error => {
        studentAction.handleError(error)
        throw Error
      }
    )
  }
};
