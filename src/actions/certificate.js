import { certificateApi } from '../core/api';
import { generalUtils } from '../core/utils/general';
import { startLoader, stopLoader } from './loader';

export const certificateAction = {
  getCertificateContent: (certID, type) => {
    return async function (dispatch) {
      dispatch(startLoader());
      return certificateApi.getCertificate(certID, type).then(
        (res) => {
          dispatch(stopLoader());
          return Promise.resolve(res.content);
        },
        (error) => {
          dispatch(stopLoader());
          generalUtils.showErrorNotification(error.message);
          return Promise.reject(error);
        },
      );
    };
  },

  downloadCertificateFile: (certID) => {
    return certificateApi.downloadCertificate(certID).then(
      (res) => {},
      (error) => {
        generalUtils.showErrorNotification(error.message);
      },
    );
  },
};
