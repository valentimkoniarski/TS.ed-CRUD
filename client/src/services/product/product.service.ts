import { API_URL } from 'src/services/utils/utils';
import axios from '../../interceptor/interceptor';

export function createProduct(product: any) {
  return axios.post(`${API_URL}product`, product);
}

export function updateProduct(productId: any, product: any) {
  return axios.put(`${API_URL}product/${productId}`, product);
}

export function findProductById(productId: any) {
  return axios.get(`${API_URL}product/${productId}`);
}

export function findAllProducts(page: any, limit: any) {
  return axios.get(`${API_URL}product`, { params: { page, limit } });
}

export function deleteProduct(productId: any) {
  return axios.delete(`${API_URL}product/${productId}`);
}
