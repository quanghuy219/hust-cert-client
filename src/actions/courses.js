import { coursesApi } from '../core/api';
import { generalUtils } from '../core/utils/general';

export const FETCH_COURSES_SUCCESS = 'FETCH_COURSES_SUCCESS';

export const coursesAction = {
  fetchCoursesSuccess: (res) => ({
    type: FETCH_COURSES_SUCCESS,
    payload: {
      data: res.data,
      itemsPerPage: res.items_per_page,
      totalItems: res.total_items,
    },
  }),

  fetchAllCourses: ({ page = 1, school_id = 1 }) => {
    return function (dispatch) {
      return coursesApi.getCourses({ page, school_id }).then(
        (res) => {
          dispatch(coursesAction.fetchCoursesSuccess(res));
          return res;
        },
        (error) => {
          generalUtils.showErrorNotification(error.message);
        },
      );
    };
  },

  createNewCourse: ({ name, credits, school_id }) => {
    return coursesApi.createCourse({ name, credits, school_id }).then(
      (res) => {
        generalUtils.showSuccessNotification('Course created successfully !');
        return res;
      },
      (error) => {
        generalUtils.showErrorNotification(error.message);
      },
    );
  },
};
