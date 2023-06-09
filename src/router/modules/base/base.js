/** When your routing table is too long, you can split it into small modules **/

const baseRouter = {
  path: '/base',
  name: '公共管理',
  component: (resolve) => require(['@/portal/' + (process.env.VUE_APP_BASE_MENU === 'withmenu'?'withmenu/' + process.env.VUE_APP_BASE_SKIN:'withoutmenu') + '/index'], resolve),
  meta: {
  },
  children: [
    {
      path: 'opLog',
      name: '系统操作日志',
      component: () => import('@/views/base/opLog/index'),
      meta: {
        title: "系统管理-系统日志"
      }
    },
    {
      path: 'errorLog',
      name: '系统异常日志',
      component: () => import('@/views/base/errorLog/index')
    },
    {
      path: 'sysdata',
      name: '基础数据',
      component: () => import('@/views/base/sysdata/index')
    },
    {
      path: 'basecodetree',
      name: '基础数据树',
      component: () => import('@/views/base/sysdata/basecodetreeinfo')
    },
    {
      path: 'remind',
      name: '系统提醒',
      component: () => import('@/views/base/remind/index')
    },
    {
      path: 'frameto',
      name: '跳转',
      component: () => import('@/views/base/frameto')
    },
    {
      path: 'querytask',
      name: '跳转',
      component: () => import('@/views/base/systemtask')
    },
    {
      path: 'sso',
      name: '跳转',
      component: () => import('@/views/base/sso')
    },
    {
      path: 'helpDocument',
      name: '系统帮助',
      component: () => import('@/views/base/helpDocument/index')
    },
    {
      path: 'excellist',
      name: 'excel列表测试',
      component: () => import('@/views/base/excelList/index')
    }
  ]
}

export default baseRouter
