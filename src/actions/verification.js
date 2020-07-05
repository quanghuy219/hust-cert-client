import { verificationApi } from '../core/api';
import { generalUtils } from '../core/utils/general';

export const verificationAction = {
  fetchStudentInformation: (shareCode) => {
    return verificationApi.getStudentInfo(shareCode).then(
      (res) => {
        return new Promise((resolve) => resolve(res));
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  },
};
