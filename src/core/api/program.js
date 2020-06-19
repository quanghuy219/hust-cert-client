import { httpRequest } from './httpRequest';

export const programApi = {
  getPrograms: (schoolId = null, name = '', page = 1, itemsPerPage = 20) => {
    const params = {
      school_id: schoolId,
      items_per_page: itemsPerPage,
      name, page
    };
    return httpRequest.get('/programs', params);
  },

  getProgramById: (programId) => {
    return httpRequest.get(`/programs/${programId}`);
  },

  createProgram: (schoolId, name, degree) => {
    const params = {
      school_id: schoolId,
      name,
      degree,
    };
    return httpRequest.post('/programs', params);
  },

  getProgramCurriculum: (programId, page = 1) => {
    const params = { page };
    return httpRequest.get(`/programs/${programId}/curriculum`, params);
  },

  addCourseToCurriculum: (programId, courseId) => {
    const params = {
      course_id: courseId,
    };
    return httpRequest.post(`/programs/${programId}/curriculum`, params);
  },

  getStudents: (programId, page = 1, itemsPerPage = 20, status = '', graduate_qualified = null) => {
    const params = {
      items_per_page: itemsPerPage,
      page,
      status,
    };

    if (typeof graduate_qualified === 'boolean') params.graduate_qualified = graduate_qualified;

    return httpRequest.get(`/programs/${programId}/students`, params);
  },
};
