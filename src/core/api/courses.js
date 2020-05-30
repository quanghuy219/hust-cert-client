import { httpRequest } from './httpRequest';

export const coursesApi = {
  getCourses: ({ school_id, page }) => {
    const params = { page, school_id };
    return httpRequest.get('/courses', params);
  },

  createCourse: ({ name, credits, school_id }) => {
    return httpRequest.post('/courses', { name, credits, school_id });
  },
};
