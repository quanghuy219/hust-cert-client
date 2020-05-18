import { httpRequest } from './httpRequest';

export const studentApi = {
  getEnrollments: () => {
    return httpRequest.get('/students/me/enrollments');
  },
};
