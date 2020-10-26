/** When your routing table is too long, you can split it into small modules **/

const baseRouter = {
  path: '/base',
  name: '公共管理',
  component: () => import('@/portal/default/index'),
  meta: {
  },
  children: [
    {
      path: 'opLog',
      name: '系统操作日志',
      component: () => import('@/views/base/opLog/index')
    },
    {
      path: 'errorLog',
      name: '系统异常日志',
      component: () => import('@/views/base/errorLog/index')
    },
    {
      path: 'sysDate',
      name: '基础数据',
      component: () => import('@/views/base/sysDate/index')
    },
    {
      path: 'baseCodeTree',
      name: '基础数据树',
      component: () => import('@/views/base/sysDate/BaseCodeTreeInfo')
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
    }
  ]
}

export default baseRouter
