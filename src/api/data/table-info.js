/* eslint-disable no-undef */
import request from '@/utils/request'

const baseURL = '/data'

const controller2 = 'tableMeta'

/* 元数据操作*/
export function listUnCached(level, schemaName, tableName) {
  return request({
    baseURL: baseURL,
    url: `/${controller2}/listUnCached`,
    method: 'get',
    params: {
      level: level,
      schemaName: schemaName,
      tableName: tableName
    }
  })
}
export function getDataTreeNode(pid) {
  return request({
    baseURL: baseURL,
    url: `/${controller2}/getDataTreeNode/${pid}`,
    method: 'get'
  })
}
/* 缓存数据操作*/
export function saveTable(data) {
  return request({
    baseURL: baseURL,
    url: `/${controller2}/save`,
    method: 'post',
    data
  })
}
export function saveTableInfo(data) {
  return request({
    baseURL: baseURL,
    url: `/${controller2}/saveTableInfo`,
    method: 'post',
    data
  })
}
export function updateTable(data) {
  return request({
    baseURL: baseURL,
    url: `/${controller2}/update`,
    method: 'put',
    data
  })
}
export function delTable(ids) {
  var param = ids.split('>')
  return request({
    baseURL: baseURL,
    url: `/${controller2}/delete/${param[0]}/${param[1]}`,
    method: 'delete'
  })
}
export function getResELTree(data) {
  if (!data) data = { dataUserId: '', sceneCode: '' }
  if (!data.type) data.type = 'common'
  return request({
    baseURL: baseURL,
    url: `/${controller2}/getResELTree`,
    method: 'get',
    params: data
  })
}
/**
 * 获取数据表列
 * @param data
 * @returns {AxiosPromise}
 */
export function getTableCol(tableMetaUuid) {
  return request({
    baseURL: baseURL,
    url: `/${controller2}/getCols`,
    method: 'post',
    params: { tableMetaUuid: tableMetaUuid }
  })
}

export function getTableInfo(tableMetaUuid) {
  return request({
    baseURL: baseURL,
    url: `/${controller2}/getTableInfo`,
    method: 'post',
    params: { tableMetaUuid: tableMetaUuid }
  })
}

export function getCreateSql(tableMetaUuid) {
  return request({
    baseURL: baseURL,
    url: `/${controller2}/getCreateSql`,
    method: 'post',
    params: { tableMetaUuid: tableMetaUuid }
  })
}

export function getBasicInfo(tableMetaUuid) {
  return request({
    baseURL: baseURL,
    url: `/${controller2}/getBasicInfo`,
    method: 'post',
    params: { tableMetaUuid: tableMetaUuid }
  })
}

export function getColsInfo(tableMetaUuid) {
  return request({
    baseURL: baseURL,
    url: `/${controller2}/getColsInfo`,
    method: 'post',
    params: { tableMetaUuid: tableMetaUuid }
  })
}

export function selectIndexInfo(tableMetaUuid) {
  return request({
    baseURL: baseURL,
    url: `/${controller2}/selectIndexInfo`,
    method: 'post',
    params: { tableMetaUuid: tableMetaUuid }
  })
}

export function getSqlType() {
  return request({
    baseURL: baseURL,
    url: `/${controller2}/getSqlType`,
    method: 'post'
  })
}

/* 角色表操作*/
const controller3 = 'roleTable'
export function getResByRole(roleUuid) {
  return request({
    baseURL: baseURL,
    url: `/${controller3}/getResByRole/${roleUuid}`,
    method: 'get'
  })
}
export function getRoleCols(roleUuid, tableUuid) {
  return request({
    baseURL: baseURL,
    url: `/${controller3}/getRoleCols?roleUuid=${roleUuid}&tableMetaUuid=${tableUuid}`,
    method: 'get'
  })
}
export function saveRoleTable(roleUuid, rfolders, rtables, rcols) {
  return request({
    baseURL: baseURL,
    url: `/${controller3}/save`,
    method: 'post',
    data: {
      roleUuid: roleUuid,
      rfolders: rfolders,
      rtables: rtables,
      rcols: rcols
    }
  })
}

export function getAccessType() {
  return request({
    baseURL: baseURL,
    url: `/${controller3}/getAccessType`,
    method: 'get'
  })
}

