import { httpRequest } from './httpRequest';

export const accountApi = {
  registerStudent: ({ name, major }) => {
    const params = { name, major };
    return httpRequest.post(`/admin/students`, params);
  },

  registerLecturer: ({ name, email, school, department }) => {
    const params = { name, email, school, department };
    return httpRequest.post(`/admin/lecturers`, params);
  },
};
