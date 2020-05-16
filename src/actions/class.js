import { classApi, lecturerApi } from '../core/api'
import { generalUtils } from '../core/utils/general'
import { func } from 'prop-types'

export const FETCH_CLASSES_SUCCESS = 'FETCH_CLASSES_SUCCESS'
export const FETCH_CLASS_SUCCESS = 'FETCH_CLASS_SUCCESS'

export const classAction = {

  fetchClassesSuccess: (res) => ({
    type: FETCH_CLASSES_SUCCESS,
    payload: {
      data: res.data,
      itemsPerPage: res.items_per_page,
      totalItems: res.total_items
    }
  }),

  fetchClassSuccess: (res) => ({
    type: FETCH_CLASS_SUCCESS,
    payload: res
  }),

  fetchAllClasses: (page = 1) => {
    return async function (dispatch) {
      await classApi.getClasses(page).then(res => {
        dispatch( classAction.fetchClassesSuccess(res) )
      }, error => {
        generalUtils.showErrorNotification(error.message)
        console.log(error)
      })
    }
  },

  fetchClassesByLecturer: (page = 1) => {
    return async function (dispatch) {
      await lecturerApi.getClasses(page).then(res => {
        dispatch( classAction.fetchClassesSuccess(res) )
      }, error => {
        generalUtils.showErrorNotification(error.message)
        console.log(error);
      })
    }
  },

  fetchClass: (classID, router) => {
    return async function (dispatch) {
      await classApi.getClass(classID).then(res => {
        dispatch( classAction.fetchClassSuccess(res) )
      }, error => {
        generalUtils.showErrorNotification(error.message)
        router.push('/home');
        console.log(error)
      })
    }
  }

}
