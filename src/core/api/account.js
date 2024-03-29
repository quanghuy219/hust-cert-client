import { httpRequest } from './httpRequest';

export const accountApi = {
  registerStudent: ({ name, program_id }) => {
    const params = { name, program_id };
    return httpRequest.post(`/admin/students`, params);
  },

  registerLecturer: ({ name, email, school, department }) => {
    const params = { name, email, school, department };
    return httpRequest.post(`/admin/lecturers`, params);
  },

  registerAdmin: ({ name, email, super_admin }) => {
    const params = { name, email, super_admin };
    return httpRequest.post(`/admin`, params);
  },
};
