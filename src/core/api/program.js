import { httpRequest } from './httpRequest';

export const programApi = {
  getPrograms: (schoolId) => {
    const params = { school_id: schoolId };
    return httpRequest.get('/programs', params);
  },

  createProgram: (schoolId, name, degree) => {
    const params = {
      school_id: schoolId,
      name,
      degree,
    };
    return httpRequest.post('/programs', params);
  },
};
