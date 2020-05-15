import { httpRequest } from './httpRequest'

export const classApi = {

	getClasses: ( page = 1 ) => {
        const params = {page}
		return httpRequest.get('/classes', params);
	},

    

}
