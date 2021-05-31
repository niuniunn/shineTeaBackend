import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return JSON.parse(localStorage.getItem('userInfo'));
  // return request('/api/currentUser');
}
