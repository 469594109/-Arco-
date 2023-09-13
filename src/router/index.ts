// import { createRouter, createWebHistory, } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';
import { getToken } from '@/utils/auth';

import { appRoutes } from './routes';
import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from './routes/base';
import createRouteGuard from './guard';

// console.log(appRoutes);

NProgress.configure({ showSpinner: false }); // NProgress Configuration
// const pathName = import.meta.env.MODE === "development"
//                 ? `` : `/${ window.location.pathname.split("/")[1] }/`;
const router = createRouter({
//   history: createWebHistory(pathName),
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: 'login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/bigScreen',
      name: 'bigScreen',
      component: () => import('@/views/bigScreen/index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    ...appRoutes,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});


router.beforeEach((to, from, next)=>{
    const isNext = from.matched.some((index) => {
        return index.path === to.path && index.name === to.name;
    });
    // console.log(to, from,isNext);
    // debugger;
    /* 未登录 */
    if (to.name === 'login') next(!0);
    else {
        if (!getToken()) {
            next('/login');
        } else {
            isNext ? next(false) : next(true);
        };
    }
    // isNext ? next(false) : next(true);
    // 
    // if(!getToken()) next('/login');
    // else 
    /* 已登录，但进入新路由路由 */
    // else isNext ? next(false) : next(true);
    // document.title = to.meta.title ? to.meta.title : "YQB管理系统";
})

createRouteGuard(router);

export default router;
