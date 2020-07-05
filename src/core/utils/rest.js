//=====================================
//  rest.js : Containing utils related to network/api calls
//-------------------------------------

export const restUtils = {
  handleRestResponse: (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response.json());
    } else if (response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user")
      localStorage.removeItem("role")
      return Promise.resolve(response.json()).then((error) => {
        const { data, message } = error;
        // eslint-disable-next-line no-throw-literal
        throw {
          status: false,
          message,
          data,
        };
      });
    } else {
      return Promise.resolve(response.json()).then((error) => {
        const { data, message } = error;
        // eslint-disable-next-line no-throw-literal
        throw {
          status: false,
          message,
          data,
        };
      });
    }
  },
};
