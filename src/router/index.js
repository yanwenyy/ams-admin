import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Router Modules */
import dataRouter from './modules/data'
import baseRouter from './modules/base/base'
import etlschedulerRouter from './modules/etlscheduler/etlscheduler'
import analysisRouter from './modules/analysis/analysis'
import graphRouter from './modules/graphtool/graphtool'

const AmsRoutes = [
  {
    path: '/dowork',
    name: '工作流',
    component: (resolve) => require(['@/portal/' + (process.env.VUE_APP_BASE_MENU === 'withmenu'?'withmenu/' + process.env.VUE_APP_BASE_SKIN:'withoutmenu') + '/index'], resolve),
    meta: {
    },
    children: [
      {
        path: '/todowork',
        name: 'todowork',
        // component: () => import('ams-starflow-vue/src/components/todowork/todowork')
        component: () => import('@/components/starflow/todowork/todowork')
      },
      {
        path: '/todoDetail',
        name: 'todoDetail',
        // component: () => import('ams-starflow-vue/src/components/todowork/todoDetail')
        component: () => import('@/components/starflow/todowork/todoDetail')
      },
    ]
  },
  {
    path: '/todoDetailOut',
    name: 'todoDetailOut',
    // component: () => import('ams-starflow-vue/src/components/todowork/todoDetailOut')
    component: () => import('@/components/starflow/todowork/todoDetailOut')
  },
  {
    path: '/earlyWaringPenetrateList',
    name: 'earlyWaringPenetrateList',
    component: () => import('ams-clue-vue/src/components/todowork/earlyWaringPenetrateList')
    //hx_base 分支不存在 ams-starflow-vue 不存在页面
  },
  {
    path: '/',
    redirect: '/ams/first'
  },
  {
    path: '/screenList',
    component: () => import('ams-datamax/src/components/screenList')
  },
  {
    path: 'publicScreenList',
    component: () => import('ams-datamax/src/components/bigScreen/admin/publicScreenList')
  },
  {
    path: '/screenEditor',
    component: () => import('ams-datamax/src/components/screenEditor')
  },
  {
    path: '/modelresulthandle',
    name: '模型结果处理',
    component: () => import('@/views/analysis/modelresulthandle/index')
  },
  {
    name: 'canvasPreview',
    path: '/canvasPreview',
    component: () => import('ams-datamax/src/components/canvasPreview')
  },
  {
    path: '/screenOp',
    component: () => import('ams-datamax/src/components/screenOp')
  }
  , {
    path: '/ams/assembly',
    component: () => import('@/views/ams/assembly/index')
  },
  {
    path: '/ams',
    name: 'ams',
    component: (resolve) => require(['@/portal/' + (process.env.VUE_APP_BASE_MENU === 'withmenu'?'withmenu/' + process.env.VUE_APP_BASE_SKIN:'withoutmenu') + '/index'], resolve),
    children: [
      {
        path: '',
        redirect: '/ams/first'
      },
      {
        path: '/repassword',
        component: () => import('@/views/error-page/repassword'),
        hidden: true
      },
      {
        path: '/nopermission',
        component: () => import('@/views/error-page/nopermission'),
        hidden: true
      },
      {
        path: 'first',
        name: 'amsFirst',
        component: (resolve) => require(['@/views/ams/home/' + process.env.VUE_APP_INDEX_PAGE + '/index'], resolve),
      },
      {
        path: '/404',
        component: () => import('@/views/error-page/404'),
        hidden: true
      },
      {
        path: '/401',
        component: () => import('@/views/error-page/401'),
        hidden: true
      },
      {
        path: 'main',
        name: 'amsMain',
        meta: {
          isShowRightFooter: true
        },
        component: () => import('@/views/ams/home/main/index')
      }
    ]
  },
  {
    path: '/frameto',
    name: 'frameto',
    component: () => import('@/views/base/frameto')
  },
  dataRouter,
  baseRouter,
  analysisRouter,
  etlschedulerRouter,
  graphRouter
]

export const constantRoutes = [
  {
    path: '/redirect',
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission',
          roles: ['admin']
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [...AmsRoutes, ...constantRoutes, ...asyncRoutes]
})

// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

//解决编程式路由往同一地址跳转时会报错的情况
const originalPush1 = Router.prototype.push;
const originalReplace = Router.prototype.replace;
//push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush1.call(this, location, onResolve, onReject);
  return originalPush1.call(this, location).catch(err => err);
};
//replace
Router.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};

export default router

