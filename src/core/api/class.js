import { httpRequest } from './httpRequest';

export const classApi = {
  getClasses: (page = 1) => {
    const params = { page };
    return httpRequest.get('/classes', params);
  },

  getClass: classID => {
    return httpRequest.get(`/classes/${classID}`);
  },

  submitGrades: (classID, grades) => {
    return httpRequest.post(`/classes/${classID}/grades`, grades);
  },

  approveGrades: classID => {
    const params = { action: 'approve_grades' };
    return httpRequest.put(`/classes/${classID}`, params);
  },

  createCertificateTemplates: classID => {
    return httpRequest.post(`/classes/${classID}/certificate-templates`);
  },

  issueCertificates: classID => {
    return httpRequest.post(`/classes/${classID}/certificates`);
  },
};
