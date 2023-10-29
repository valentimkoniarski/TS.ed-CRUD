import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(<string>localStorage.getItem('token'));
    if (user) {
      config.headers.Authorization = user;
    }

    config.validateStatus = function (status) {
      if (status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return status >= 200 && status < 300;
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axios;
