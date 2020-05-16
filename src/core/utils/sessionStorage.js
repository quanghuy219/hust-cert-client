export const ssStorage = {
  set: (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  get: (key) => {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : data;
  },
};
