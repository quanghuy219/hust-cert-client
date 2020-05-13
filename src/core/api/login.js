import { httpRequest } from './httpRequest'

export const loginApi = {

	login: ( email, password, actor ) => {
        const params = {email, password, actor}
		return httpRequest.post('/login', params);
	},

	studentLogin: (id, password) => {
		const params = {id, password}
		return httpRequest.post('/students/login', params);
	}

}
