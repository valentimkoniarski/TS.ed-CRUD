import axios from '../../interceptor/interceptor';

import { API_URL } from '../utils/utils';
import { UserRegister } from 'src/models/UserRegister';
import { UserLogin } from 'src/models/UserLogin';
import { errorRequestNotificationUtil } from 'src/utils/error-request-notification.util';

export function login(user: UserLogin) {
  return axios.post(API_URL + 'auth/login', user);
}

export function register(userRegister: UserRegister) {
  return axios.post(API_URL + 'auth/register', userRegister);
}

export function verifyEmail() {
  return axios.get(API_URL + 'auth/validator');
}

export function activeAccount(token: string) {
  return axios.post(API_URL + 'auth/validator/' + token);
}

export async function userInfo() {
  return await axios.get(API_URL + 'auth/user-info');
}

export function logout() {
  localStorage.removeItem('user');
}
