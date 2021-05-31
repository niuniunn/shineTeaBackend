import { stringify } from 'qs';
import request from '@/utils/request';

export async function idpLogin(params) {
  return request('/api/back/login/idpLogin' + `?${stringify(params)}`, {
    method: 'POST',
    data: params,
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/back/login', {
    method: 'POST',
    data: params,
  });
}

/*店铺管理*/
export async function getShopList(params) {
  return request('api/shinetea/shop/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: stringify(params),
  });
}

export async function newShop(params) {
  return request('api/shinetea/shop/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: stringify(params),
  });
}

export async function editShop(params) {
  return request('api/shinetea/shop/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: stringify(params),
  });
}

export async function updateStatus(params) {
  return request('api/shinetea/shop/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: stringify(params),
  });
}

export async function findShopById(params) {
  return request('api/shinetea/shop/detail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: stringify(params),
  });
}
/*分类管理*/
export async function getCategoryList(params) {
  return request('api/shinetea/category/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: stringify(params),
  });
}

export async function newCategory(params) {
  return request('api/shinetea/category/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: stringify(params),
  });
}

export async function editCategory(params) {
  return request('api/shinetea/category/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: stringify(params),
  });
}

export async function delCategory(params) {
  return request('api/shinetea/category/del', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: stringify(params),
  });
}
