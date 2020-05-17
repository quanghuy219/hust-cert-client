import { httpRequest } from './httpRequest';

export const certificateApi = {
  getCertificate: (certID, type) => {
    const params = { type };
    return httpRequest.get(`/certificates/${certID}`, params);
  },
};
