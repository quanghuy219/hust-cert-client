import { httpRequest } from './httpRequest';

export const studentApi = {
  getEnrollments: () => {
    return httpRequest.get('/students/me/enrollments');
  },

  createVerfificationRequest: (verifier, enrollments = [], degrees = [], duration) => {
    const params = {
      verifier,
      enrollments,
      degrees,
      duration
    };
    return httpRequest.post('/students/me/verifications', params);
  },
};
