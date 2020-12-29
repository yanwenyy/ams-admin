import request from '@/utils/request'
const baseURL = '/graphtool'
const dataUrl = '/data'
const analysisUrl = '/analysis'

/**
 * 获取图形树
 */
export function getGraphTrees() {
  return request({
    baseURL: baseURL,
    url: '/graphCt/getGraphTrees',
    method: 'post'
  })
}

/**
 * 点击图形树节点获取图形列表
 */
export function getGrapgListByType(data, param) {
  let obj = {
    baseURL: baseURL,
    url: '/graphCt/pageList',
    method: 'post',
    data// RequestBody类型参数
  }
  if (typeof param !== "undefined") {
    obj.params = param// RequestParam类型参数
  }
  return request(obj)
}

/**
 * 根据图形UUID获取图形信息
 */
export function getGraphInfoById(id) {
  return request({
    baseURL: baseURL,
    url: `/graphCt/getById/${id}`,
    method: 'get'
  })
}

/**
 * 根据图形UUID删除图形
 * @param ids 图形UUID串，以逗号分隔
 */
export function deleteGraphInfoById(ids) {
  return request({
    baseURL: baseURL,
    url: `/graphCt/delete/${ids}`,
    method: 'delete'
  })
}

/**
 * 分享图形
 * @param data 参数1：图形UUID串，以逗号分隔；参数2：图形名称串，以顿号分隔
 * 参数3：被分享人员UUID串，以逗号分隔；参数4：被分享人员名称串，以顿号分隔
 */
export function shareGraph(data) {
  return request({
    baseURL: baseURL,
    url: `/graphShare/shareGraph`,
    method: 'post',
    params: data
  })
}

/**
 * 取消分享图形
 * @param data 参数1：图形UUID；参数2：图形名称
 * 参数3：被分享人员UUID串，以逗号分隔；参数4：被分享人员名称串，以顿号分隔
 */
export function cancelShareGraph(data) {
  return request({
    baseURL: baseURL,
    url: `/graphShare/cancelShareGraph`,
    method: 'post',
    params: data
  })
}

/**
 * 获取数据表列信息
 * @param tableMetaUuid 数据表ID
 * @returns {AxiosPromise}
 */
export function getTableCol(tableMetaUuid) {
  return request({
    baseURL: dataUrl,
    url: '/tableMeta/getCols',
    method: 'post',
    async: false, // 默认同步
    params: { tableMetaUuid: tableMetaUuid }
  })
}

/**
 * 图形保存
 * @param data 图形对象信息
 * @returns {AxiosPromise}
 */
export function saveGraphInterface(data) {
  return request({
    baseURL: baseURL,
    url: '/graphCt/save',
    method: 'post',
    data
  })
}

/**
 * 保存场景查询图形
 * @param data 图形对象信息
 */
export function createScreenQuery(data) {
    return request({
        baseURL: baseURL,
        url: '/graphCt/createScreenQuery',
        method: 'post',
        data
    })
}

/**
 * 根据图形ID查询执行节点集合
 */
export function getExecuteNodeInfoPost(data) {
  return request({
    baseURL: baseURL,
    url: '/graphExecuteNode/getExecuteNodeInfo',
    method: 'post',
    params: data
  })
}

/**
 * 获取可导出的图形列表
 */
export function getExportGrapgListByType(data, param) {
    let obj = {
        baseURL: baseURL,
        url: '/graphCt/exportPageList',
        method: 'post',
        data// RequestBody类型参数
    }
    if (typeof param !== "undefined") {
        obj.params = param// RequestParam类型参数
    }
    return request(obj)
}

/**
 * 导出图形文件
 */
export function exportGraphXml(data){
    return request({
        baseURL: baseURL,
        url: '/graphCt/exportGraphXml',
        method: 'post',
        params:data
    })
}

/**
 * 导入图形XML文件
 */
export function importGraphXml(formData) {
    return request({
        baseURL: baseURL,
        url: '/graphCt/importGraphXml',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

/**
 * 删除图形执行缓冲表的数据
 */
export function deleteExecuteNodes(ids) {
    return request({
        baseURL: baseURL,
        url: `/graphExecuteNode/delete/${ids}`,
        method: 'get',
    })
}

/**
 * 执行节点
 */
export function executeNodeSql(data) {
    return request({
        baseURL: baseURL,
        url: '/graphCt/executeNodeSql',
        method: 'post',
        data,
    })
}

/**
 * 执行全部节点
 */
export function executeAllNodeSql(data) {
    return request({
        baseURL: baseURL,
        url: '/graphCt/executeAllNodeSql',
        method: 'post',
        data
    })
}

/**
 * 预览节点结果
 */
export function viewNodeData(data) {
    return request({
        baseURL: baseURL,
        url: '/graphCt/viewNodeData',
        method: 'post',
        data,
    })
}

/**
 * 检测当前数据表的数据量是否大于预设阈值
 */
export function verifyLargeData(data) {
    return request({
        baseURL: baseURL,
        url: '/graphCt/verifyLargeData',
        method: 'post',
        params:data,
    })
}

/**
 * 获取数据表字段的最大值和最小值
 */
export function getMaxMinColumn(data) {
    return request({
        baseURL: baseURL,
        url: '/graphCt/getMaxMinColumn',
        method: 'post',
        params:data,
    })
}

/**
 * 将原SQL与参数SQL进行拼接
 * @param data
 */
export function dealReplaceParamSql(data) {
    return request({
        baseURL: baseURL,
        url: '/graphCt/dealReplaceParamSql',
        method: 'post',
        params:data,
    })
}

/**
 * 获取所有母版参数集合以及模型用到的参数集合
 */
export function findParamsAndModelRelParams() {
    return request({
        baseURL: analysisUrl,
        url: '/paramController/findParamsAndModelRelParams',
        method: 'post'
    })
}

/**
 * 执行当前参数SQL语句
 * @param {*} data   SQL语句
 */
export function executeParamSql(data) {
    return request({
        baseURL: analysisUrl,
        url: '/paramController/executeParamSql',
        method: 'post',
        async:false,
        data
    })
}

/**
 * 查询下拉树参数SQL的结果集
 * @param {*} sqlValue sql语句
 */
export function getSelectTreeData(sqlValue) {
    const data = {
        sqlValue: sqlValue
    }
    return request({
        baseURL: analysisUrl,
        url: '/paramController/getSelectTreeData',
        method: 'post',
        data
    })
}

/**
 * 替换参数SQL语句
 * @param sql sql语句
 * @param paramArr 参数Json字符串
 */
async function replaceModelSqlByParams(sql, paramArr) {
    const data = {
        sqlValue: sql,
        paramConditions: paramArr
    }
    return await request({
        baseURL: analysisUrl,
        url: '/paramController/replaceSqlByAllowedNull',
        method: 'post',
        data
    })
}

/**
 * 对比SQL语句是否发生变化
 * @param data
 */
export function compareSql(data){
    return request({
        baseURL: baseURL,
        url: '/graphCt/compareSql',
        method: 'post',
        params: data
    })
}
