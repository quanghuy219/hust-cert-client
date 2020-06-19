import { httpRequest } from './httpRequest';

export const schoolsApi = {
  getSchools: () => {
    return httpRequest.get(`/schools`);
  },

  getDepartmentsBySchoolId: ({ school_id }) => {
    const params = { school_id };
    return httpRequest.get(`/departments`, params);
  },

  getLecturers: ({ school_id }) => {
    return httpRequest.get('/lecturers', { school_id });
  },
};
