import request from '@/utils/request'

const baseURL = '/base'
const controllerName = 'zhBaseDataSortInfo'

export function listByPage(data) {
  return request({
    baseURL: baseURL,
    url: '/zhBaseDataSortInfo/selectPage',
    method: 'post',
    // 直接加data以json格式传递  后台用RequestBody
    data
  })
}

export function save(data) {
  return request({
    baseURL: baseURL,
    url: `/${controllerName}/save`,
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    baseURL: baseURL,
    url: `/${controllerName}/update`,
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    baseURL: baseURL,
    url: `/${controllerName}/delete/${ids}`,
    method: 'delete'
  })
}

export function inItCode(data) {
  return request({
    baseURL: baseURL,
    url: `/zhBaseCodeInfo/search`,
    method: 'post',
    // 直接加data以json格式传递  后台用RequestBody
    data
  })
}

// 基础数据值操作
export function saveSecond(data) {
  return request({
    baseURL: baseURL,
    url: `/zhBaseCodeInfo/save`,
    method: 'post',
    data
  })
}

export function updateSecond(data) {
  return request({
    baseURL: baseURL,
    url: `/zhBaseCodeInfo/update`,
    method: 'put',
    data
  })
}

export function delSecond(data) {
  return request({
    baseURL: baseURL,
    url: `/zhBaseCodeInfo/delete`,
    method: 'delete',
    data
  })
}

export function loadchildnodeOne(data) {
  return request({
    baseURL: baseURL,
    url: `/zhBaseCodeInfo/search`,
    method: 'post',
    data
  })
}

