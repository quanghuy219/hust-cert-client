import { httpRequest } from './httpRequest';

export const classApi = {
  getClasses: (page = 1) => {
    const params = { page };
    return httpRequest.get('/classes', params);
  },

  getClass: (classID) => {
    return httpRequest.get(`/classes/${classID}`);
  },

  createClass: ({ semester, course_id, lecturer_id }) => {
    return httpRequest.post(`/classes`, { semester, course_id, lecturer_id });
  },

  submitGrades: (classID, grades) => {
    return httpRequest.post(`/classes/${classID}/grades`, grades);
  },

  approveGrades: (classID) => {
    const params = { action: 'approve_grades' };
    return httpRequest.put(`/classes/${classID}`, params);
  },

  createCertificateTemplates: (classID) => {
    return httpRequest.post(`/classes/${classID}/certificate-templates`);
  },

  issueCertificates: (classID) => {
    return httpRequest.post(`/classes/${classID}/certificates`);
  },

  enrollStudent: ({ studentID, classID }) => {
    const params = { student_id: studentID, class_id: classID };

    return httpRequest.post(`/enrollments`, params);
  },
};
