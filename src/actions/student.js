import { studentApi } from '../core/api';
import { generalUtils } from '../core/utils/general';

export const FETCH_ENROLLMENTS_SUCCESS = 'FETCH_ENROLLMENTS_SUCCESS';

export const studentAction = {
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
          generalUtils.showErrorNotification(error.message);
          console.log(error);
        },
      );
    };
  },

  createVerificationRequest: (verifier, enrollments = [], degrees = [], duration) => {
    return studentApi.createVerfificationRequest(verifier, enrollments, degrees, duration).then(
      res => {
        return Promise.resolve(res)
      },
      error => {
        generalUtils.showErrorNotification(error.message);
      }
    )
  }
};
