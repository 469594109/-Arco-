import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localTablePage from '@/components/table/locale/zh-CN';// 搜索表格数据组件

import localeSettings from './zh-CN/settings';

export default {
    'navbar.systemName': 'YQB系统',
    'menu.groupMenu': '首页',  
    'menu.groupMenu.systemSettings': '系统设置',
    'menu.groupMenu.menu.groupMenu.accountManage': '账号管理',
    'menu.groupMenu.menu.groupMenu.roleManage': '角色管理',
    'menu.groupMenu.menuAdmin': '菜单管理',
    'menu.groupMenu.systemParam': '系统参数',
    ...localeSettings,
    ...localeMessageBox,
    ...localeLogin,
    ...localTablePage,
};
