import { httpRequest } from './httpRequest';

export const schoolsApi = {
  getSchools: () => {
    return httpRequest.get(`/schools`);
  },
};
