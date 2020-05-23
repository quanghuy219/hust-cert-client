import { certificateApi } from '../core/api';
import { generalUtils } from '../core/utils/general';

export const certificateAction = {
  getCertificateContent: (certID, type) => {
    return certificateApi.getCertificate(certID, type).then(
      res => {
        return new Promise(resolve => resolve(res.content))
      },
      error => {
        generalUtils.showErrorNotification(error.message);
      },
    );
  },

  downloadCertificateFile: (certID) => {
    return certificateApi.downloadCertificate(certID).then(
      res => {

      },
      error => {
        generalUtils.showErrorNotification(error.message);
      }
    )
  }
};
