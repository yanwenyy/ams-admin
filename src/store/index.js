import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import dag from './modules/dag'
import security from './modules/security'
import datasource from './modules/datasource'
import projects from './modules/projects'
import monitor from './modules/monitor'
import resource from './modules/resource'
// import applyInfo from 'ams-starflow-vue/src/store/modules/applyInfo'
import applyInfo from '@/store/modules/applyInfo'


Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  // 把dag用到的store加入到modules中
  modules['dag'] = dag
  modules['security'] = security
  modules['datasource'] = datasource
  modules['projects'] = projects
  modules['monitor'] = monitor
  modules['resource'] = resource
  modules['applyInfo'] = applyInfo
  return modules
}, {})

const store = new Vuex.Store({
  getters,
  modules
})

export default store
