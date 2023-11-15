// TODO colocar em variavel de ambiente
export const API_URL = 'https://tsed-crud-production.up.railway.app/rest/';
//export const API_URL = `http://0.0.0.0:8083/rest/`;

export const ERROR_NETWORK_REDIRECT = () => {
  window.location.href = '/#/error-network';
};

export const ERROR_BAD_REQUEST_REDIRECT = () => {
  window.location.href = '/#/login';
};
