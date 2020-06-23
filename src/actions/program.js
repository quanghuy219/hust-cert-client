import { programApi } from '../core/api';
import { generalUtils } from '../core/utils/general';
import { startLoader, stopLoader } from './loader';

export const programAction = {
  createDiplomaTemplates: (programID) => {
    return async function (dispatch) {
      dispatch(startLoader());
      return programApi.createDiplomaTemplate(programID).then(
        (res) => {
          dispatch(stopLoader());
					generalUtils.showSuccessNotification('Create diploma templates successfully');
					return Promise.resolve(res)
        },
        (error) => {
          dispatch(stopLoader());
					generalUtils.showErrorNotification(error.message || 'Something went wrong');
					return Promise.reject(error)
        },
      );
    };
  },

  issueDiploma: (programID) => {
    return async function (dispatch) {
      dispatch(startLoader());
      return programApi.issueDiploma(programID).then(
        (res) => {
          dispatch(stopLoader());
					generalUtils.showSuccessNotification('Create certificates successfully');
					return Promise.resolve(res)
        },
        (error) => {
          dispatch(stopLoader());
					generalUtils.showErrorNotification(error.message || 'Something went wrong');
					return Promise.reject(error)
        },
			)
			.catch((err) => console.error('Error: ', err));
    };
  },
};
