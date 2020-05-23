import { classApi, lecturerApi } from '../core/api';
import { generalUtils } from '../core/utils/general';

export const FETCH_CLASSES_SUCCESS = 'FETCH_CLASSES_SUCCESS';
export const FETCH_CLASS_SUCCESS = 'FETCH_CLASS_SUCCESS';
export const UPDATE_GRADES_SUCCESS = 'UPDATE_GRADES_SUCCESS';

export const classAction = {
  fetchClassesSuccess: res => ({
    type: FETCH_CLASSES_SUCCESS,
    payload: {
      data: res.data,
      itemsPerPage: res.items_per_page,
      totalItems: res.total_items,
    },
  }),

  fetchClassSuccess: res => ({
    type: FETCH_CLASS_SUCCESS,
    payload: res,
  }),

  updateGradesSuccess: res => ({
    type: UPDATE_GRADES_SUCCESS,
    payload: res,
  }),

  fetchAllClasses: (page = 1) => {
    return async function(dispatch) {
      await classApi.getClasses(page).then(
        res => {
          dispatch(classAction.fetchClassesSuccess(res));
        },
        error => {
          generalUtils.showErrorNotification(error.message);
        },
      );
    };
  },

  fetchClassesByLecturer: (page = 1) => {
    return async function(dispatch) {
      await lecturerApi.getClasses(page).then(
        res => {
          dispatch(classAction.fetchClassesSuccess(res));
        },
        error => {
          generalUtils.showErrorNotification(error.message);
        },
      );
    };
  },

  fetchClass: (classID, router) => {
    return async function(dispatch) {
      await classApi.getClass(classID).then(
        res => {
          dispatch(classAction.fetchClassSuccess(res));
        },
        error => {
          generalUtils.showErrorNotification(error.message);
          router.push('/home');
        },
      );
    };
  },

  submitGrades: (classID, grades) => {
    return async function(dispatch) {
      classApi.submitGrades(classID, grades).then(
        res => {
          dispatch(classAction.updateGradesSuccess(res));
          generalUtils.showSuccessNotification('Grades updated successfully');
        },
        error => {
          generalUtils.showErrorNotification(error.message);
        },
      );
    };
  },

  approveGrades: classID => {
    return async function(dispatch) {
      classApi.approveGrades(classID).then(
        res => {
          dispatch(classAction.fetchClassSuccess(res));
          generalUtils.showSuccessNotification('Grades approved for this class');
        },
        error => {
          generalUtils.showErrorNotification(error.message);
        },
      );
    };
  },

  createCertificateTemplates: classID => {
    return async function(dispatch) {
      classApi.createCertificateTemplates(classID).then(
        res => {
          dispatch(classAction.fetchClassSuccess(res));
          generalUtils.showSuccessNotification('Create certificate templates successfully');
        },
        error => {
          generalUtils.showErrorNotification(error.message || "Something went wrong");
        },
      );
    };
  },

  issueCertificates: classID => {
    return async function(dispatch) {
      classApi.issueCertificates(classID).then(
        res => {
          dispatch(classAction.fetchClassSuccess(res));
          generalUtils.showSuccessNotification('Create certificates successfully');
        },
        error => {
          generalUtils.showErrorNotification(error.message || "Something went wrong");
        },
      );
    };
  }
};
