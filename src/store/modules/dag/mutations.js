import _ from 'lodash'
import $ from 'jquery'

export default {
  setProjectName(state, payload) {
    state.projectName = payload
  },
  /**
   * set tasks
   * */
  setTasks(state, payload) {
    state.tasks = payload
  },
  /**
   * set locations
   * */
  setLocations(state, payload) {
    state.locations = payload
  },
  /**
   * add locations
   * */
  addLocations(state, payload) {
    state.locations = Object.assign(state.locations, {}, payload)
  },
  /**
   * set connects
   * */
  setConnects(state, payload) {
    state.connects = payload
  },
  /**
   * set dag name
   */
  setName(state, payload) {
    state.name = payload
  },
  /**
   * set timeout
   */
  setTimeout(state, payload) {
    state.timeout = payload
  },
  /**
   * set tenantId
   */
  setTenantId(state, payload) {
    state.tenantId = payload
  },
  /**
   * set global params
   */
  setGlobalParams(state, payload) {
    state.globalParams = payload
  },
  /**
   * set description
   */
  setDesc(state, payload) {
    state.description = payload
  },
  // TODO
  /**
   * set status
   */
  setStatus(state, payload) {
    state.status = payload
  },
  /**
   * set orderNo
   */
  setOrderNo(state, payload) {
    state.orderNo = payload
  },
  /**
   * Whether to update the process definition
   */
  setSyncDefine(state, payload) {
    state.syncDefine = payload
  },
  /**
   * Whether to edit the parameters
   */
  setIsEditDag(state, payload) {
    state.isEditDag = payload
  },

  /**
   * edit state
   */
  setIsDetails(state, payload) {
    state.isDetails = payload
  },

  /**
   * reset params
   */
  resetParams(state, payload) {
    $('#canvas').html('')
    state.globalParams = (payload && payload.globalParams) || []
    state.tasks = (payload && payload.tasks) || []
    state.name = (payload && payload.name) || ''
    state.description = (payload && payload.description) || ''
    // TODO
    state.status = (payload && payload.status) || ''
    state.orderNo = (payload && payload.orderNo) || null
    state.timeout = (payload && payload.timeout) || 0
    state.tenantId = (payload && payload.tenantId) || -1
    state.processListS = (payload && payload.processListS) || []
    state.classListS = (payload && payload.classListS) || []
    state.resourcesListS = (payload && payload.resourcesListS) || []
    state.resourcesListJar = (payload && payload.resourcesListJar) || []
    state.projectListS = (payload && payload.projectListS) || []
    state.isDetails = (payload && payload.isDetails) || false
    state.runFlag = (payload && payload.runFlag) || ''
    state.locations = (payload && payload.locations) || {}
    state.connects = (payload && payload.connects) || []
  },
  /**
   * add task
   * object {}
   */
  addTasks(state, payload) {
    const i = _.findIndex(state.tasks, v => v.id === payload.id)
    if (i !== -1) {
      state.tasks[i] = Object.assign(state.tasks[i], {}, payload)
    } else {
      state.tasks.push(payload)
    }
    if (state.cacheTasks[payload.id]) {
      state.cacheTasks[payload.id] = Object.assign(state.cacheTasks[payload.id], {}, payload)
    } else {
      state.cacheTasks[payload.id] = payload
    }
    const dom = $(`#${payload.id}`)
    state.locations[payload.id] = _.assign(state.locations[payload.id], {
      name: dom.find('.name-p').text(),
      targetarr: dom.attr('data-targetarr'),
      nodenumber: dom.attr('data-nodenumber'),
      x: parseInt(dom.css('left'), 10),
      y: parseInt(dom.css('top'), 10)
    })
  },
  /**
   * Cache the input
   * @param state
   * @param payload
   */
  cacheTasks(state, payload) {
    if (state.cacheTasks[payload.id]) {
      state.cacheTasks[payload.id] = Object.assign(state.cacheTasks[payload.id], {}, payload)
    } else {
      state.cacheTasks[payload.id] = payload
    }
  }
}
