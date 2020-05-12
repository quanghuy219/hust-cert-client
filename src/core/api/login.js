import { httpRequest } from './httpRequest'

export const loginApi = {
	/**
	 * Fetch video search results from the Youtube API
	 * @param username
	 * @param password
	 * @returns {Promise.<TResult>}
	 */
	login: ( email, password ) => {
        const params = {email, password, actor: 'admin'}
		return httpRequest.post('/login', params);
	}
}
