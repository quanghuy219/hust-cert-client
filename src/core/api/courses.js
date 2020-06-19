import { httpRequest } from './httpRequest';

export const coursesApi = {
  getCourses: ({ school_id = 0, page = 1, name = ''}) => {
    const params = { page, school_id, name };
    return httpRequest.get('/courses', params);
  },

  createCourse: ({ name, credits, school_id }) => {
    return httpRequest.post('/courses', { name, credits, school_id });
  },
};
