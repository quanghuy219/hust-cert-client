import { httpRequest, getHeaders } from './httpRequest';
import config from '../configs';

export const certificateApi = {
  getCertificate: (certID, type) => {
    const params = { type };
    return httpRequest.get(`/certificates/${certID}/content`, params);
  },

  downloadCertificate: (certID, filename = 'certificate.json') => {
    const options = {
      headers: getHeaders(),
      method: 'GET',
    };
    delete options.headers['Content-Type'];

    return fetch(`${config.BASE_URL}/certificates/${certID}`, options)
      .then((response) => response.blob())
      .then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  },
};
