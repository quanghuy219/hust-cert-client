import { httpRequest } from './httpRequest';

export const studentApi = {
  getStudentInfo: () => {
    return httpRequest.get(`/students/me`);
  },

  getEnrollments: () => {
    return httpRequest.get('/students/me/enrollments');
  },

  getVerficationHistory: () => {
    return httpRequest.get('/students/me/verifications')
  },

  createVerfificationRequest: (verifier, enrollments = [], degrees = [], duration) => {
    const params = {
      verifier,
      enrollments,
      duration,
      diplomas: degrees
    };
    return httpRequest.post('/students/me/verifications', params);
  },
};
