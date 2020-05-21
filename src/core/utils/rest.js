//=====================================
//  rest.js : Containing utils related to network/api calls
//-------------------------------------

export const restUtils = {
  handleRestResponse: (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response.json());
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
