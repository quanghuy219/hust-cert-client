import { accountApi } from '../core/api';
import { generalUtils } from '../core/utils/general';

export const REGISTER_LECTURER_SUCCESS = 'REGISTER_LECTURER_SUCCESS';
export const REGISTER_STUDENT_SUCCESS = 'REGISTER_STUDENT_SUCCESS';

export const accountAction = {
  registerStudentAccount: ({ name, program_id }) => {
    return accountApi.registerStudent({ name, program_id }).then(
      (res) => {
        console.log('response', res);
        generalUtils.showSuccessNotification(res.message);
        return res.data;
      },
      (error) => {
        generalUtils.showErrorNotification(error.message);
      },
    );
  },

  registerLecturerAccount: ({ name, email, school, department }) => {
    return accountApi.registerLecturer({ name, email, school, department }).then(
      (res) => {
        console.log('response', res);
        generalUtils.showSuccessNotification(res.message);
        return res.data;
      },
      (error) => {
        generalUtils.showErrorNotification(error.message);
      },
    );
  },

  registerAdminAccount: ({ name, email, super_admin }) => {
    return accountApi.registerAdmin({ name, email, super_admin }).then(
      (res) => {
        console.log('response', res);
        generalUtils.showSuccessNotification(res.message);
        return res.data;
      },
      (error) => {
        generalUtils.showErrorNotification(error.message);
      },
    );
  },
};
