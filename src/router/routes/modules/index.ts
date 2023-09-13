import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';
import PageLayout from '../../../layout/page-layout.vue';

const DASHBOARD: AppRouteRecordRaw = {
    path: '/index',
    name: 'index',
    component: DEFAULT_LAYOUT,
    meta: {
        title: '',
        locale: 'menu.groupMenu',
        requiresAuth: true,
        icon: 'icon-home',
        order: 1,
    },
    children: [
        {
            path: 'systemSettings',
            name: 'systemSettings',
            component: PageLayout,
            meta: {
                title: "系统设置",
                locale: 'menu.groupMenu.systemSettings',
                icon: 'icon-settings',
                requiresAuth: true,
                roles: ['*'],
            },
            children:[
                {
                    path: 'accountManage',
                    name: 'accountManage',
                    component: () => import('@/views/index/systemSettings/accountManage/index.vue'),
                    meta: {
                        title: "账号管理",
                        locale: 'menu.groupMenu.accountManage',
                        requiresAuth: true,
                        roles: ['*'],
                    },
                },
                {
                    path: 'roleManage',
                    name: 'roleManage',
                    component: () => import('@/views/index/systemSettings/roleManage/index.vue'),
                    meta: {
                        title: "角色管理",
                        locale: 'menu.groupMenu.roleManage',
                        requiresAuth: true,
                        roles: ['*'],
                    },
                },
                {
                    path: 'menuAdmin',
                    name: 'menuAdmin',
                    component: () => import('@/views/index/systemSettings/menuAdmin/index.vue'),
                    meta: {
                        title: "菜单管理",
                        locale: 'menu.groupMenu.menuAdmin',
                        requiresAuth: true,
                        roles: ['*'],
                    },
                },
                {
                    path: 'systemParam',
                    name: 'systemParam',
                    component: () => import('@/views/index/systemSettings/systemParam/index.vue'),
                    meta: {
                        title: "系统参数",
                        locale: 'menu.groupMenu.systemParam',
                        requiresAuth: true,
                        roles: ['*'],
                    },
                },

            ]
        },
    ],
};

export default DASHBOARD;
