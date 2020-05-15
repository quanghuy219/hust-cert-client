import { classApi, lecturerApi } from '../core/api'
import { generalUtils } from '../core/utils/general'

export const FETCH_CLASSES_SUCCESS = 'FETCH_CLASSES_SUCCESS'

export const classAction = {

  fetchClassSuccess: (res) => ({
    type: FETCH_CLASSES_SUCCESS,
    payload: {
      data: res.data,
      itemsPerPage: res.items_per_page,
      totalItems: res.total_items
    }
  }),

  fetchAllClasses: (page = 1) => {
    return async function (dispatch) {
      await classApi.getClasses(page).then(res => {
        dispatch( classAction.fetchClassSuccess(res) )
      }, error => {
        generalUtils.showErrorNotification(error.message)
        console.log(error)
      })
    }
  },

  fetchClassesByLecturer: (page = 1) => {
    return async function (dispatch) {
      await lecturerApi.getClasses(page).then(res => {
        dispatch( classAction.fetchClassSuccess(res) )
      }, error => {
        generalUtils.showErrorNotification(error.message)
        console.log(error);
      })
    }
  }
}
