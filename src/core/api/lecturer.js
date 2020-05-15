import { httpRequest } from './httpRequest'

export const lecturerApi = {

	getClasses: ( page = 1 ) => {
        const params = {page}
		return httpRequest.get('/lecturers/me/classes', params);
	},

}
