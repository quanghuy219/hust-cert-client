import { httpRequest } from './httpRequest';

export const verificationApi = {
  getStudentInfo: (shareCode) => {
    const params = {
      share_code: shareCode,
    };
    return httpRequest.get('/verifications', params);
  },
};
